angular.module("edTriagePatientFactory", [])
    .factory('EdTriagePatient', ['$filter', 'EdTriageConcept', function ($filter, EdTriageConcept) {

        /**
         * Constructor, with class name
         */
        function EdTriagePatient() {
            this.encounterUuid = null;
            this.triageQueueStatus = {value:EdTriageConcept.status.waitingForEvaluation};
            this.encounterDateTime = null;
            this.score = {colorCode: EdTriageConcept.score.green, numericScore:0};
            this.percentComplete = 0;  // this is used when the score is calculated
            this.originalObservationUuids = [];
            this.patient = {uuid:null, age:null, birthdate:null, gender:null, ageType:null, display:null};
            this.location = null;
            this.chiefComplaint = null;
            this.vitals = {
                mobility: null,
                respiratoryRate: null,
                oxygenSaturation: null,
                heartRate: null,
                diastolicBloodPressure: null,
                systolicBloodPressure: null,
                temperature: null,
                consciousness: null,
                trauma: null,
                weight: null
            };
            this.symptoms = {
                neurological: null,
                burn: null,
                trauma: null,
                digestive: null,
                pregnancy: null,
                respiratory: null,
                pain: null,
                other: null
            };

        }
        /*
        * gets the html color for the code
        * */
        EdTriagePatient.prototype.getColorHtmlCode = function(){
            var ret = 'green';
            var colorCode = this.score.colorCode;
            if(colorCode == EdTriageConcept.score.red){
                ret = "red";
            }
            else if(colorCode == EdTriageConcept.score.orange){
                ret = "orange";
            }
            else if(colorCode == EdTriageConcept.score.yellow){
                ret = "yellow";
            }
            else{
                ret = "green";
            }
            return ret;
        };

        /* calculates the wait time for a patient
        * @param {num} serverDateTimeDeltaInMillis - the difference between the sevrver time and the client time
        * @return {String} the formatted wait time */
        EdTriagePatient.prototype.waitTime = function(serverDateTimeDeltaInMillis){
            var date = new Date(this.encounterDateTime);
            var now = new Date();
            var delta = serverDateTimeDeltaInMillis==null?0:serverDateTimeDeltaInMillis;
            var w = (delta + now.getTime() - date.getTime())/1000;
            //this fixes any small differences in time, it shouldn't happen
            if(w < 0){
                w =0;
            }
            var hr = Math.floor(w /60 /60);
            var mn = Math.floor((w /60) % 60);
            //var sec = Math.floor(w % 60);
            return hr + ":" + (mn<10?"0"+mn:mn);// + ":" + (sec<10?"0"+sec:sec);
        }  ;

        /* creates a new EdTriagePatient
         *  returns an empty one with the patient and location info filled in
         *  @param {String} uuid - the patient uuid
         *  @param {Object} dateOfBirth - the patient date of birth
         *  @param {String} gender - the patient gender
         *  @param {String} locationUuid - the location uuid
         * @returns {EdTriagePatient} the concepts that make up this app
         * */
        EdTriagePatient.newInstance = function(uuid, dateOfBirth, gender, locationUuid) {
            var ret = new EdTriagePatient();
            var diff = Math.floor(new Date().getTime() - dateOfBirth.getTime());
            var yr = 1000 * 60 * 60 * 24 *365;
            var age = Math.floor(diff/yr) ; //TODO: calc the real age
            var ageType = 'A';
            if(age < 3){
               ageType = 'I';
            }
            else if (age < 13){
                ageType = 'C';
            }
            ret.patient.uuid = uuid;
            ret.patient.age = age;
            ret.patient.birthdate=dateOfBirth;
            ret.patient.gender=gender;
            ret.patient.age = age;
            ret.patient.ageType=ageType;
            ret.location = locationUuid;

            return ret;
        };

        EdTriagePatient.buildList = function (concepts, data, locationUuid) {

            var patientDateOfBirth = new Date("October 13, 1974 11:13:00");    //TODO:  need to get this information
            var patientGender = "F";         //TODO:  need to get this information
            var ret = [];
            for(var i = 0;i<data.length;++i){
                var patientUuid = data[i].patient.uuid;
                var edTriagePatient = EdTriagePatient.build(concepts, data[i], patientDateOfBirth, patientGender, locationUuid);
                //we need to do this, b/c I couldn't figure out how to make the web service filter these out.  if we figure this out
                // then this line can be removed
                if(edTriagePatient.triageQueueStatus.value == EdTriageConcept.status.waitingForEvaluation){
                    ret.push(edTriagePatient);
                }

            }
            return ret;
        };
        
        /**
         * builds a class from the edtriage concepts and the data from the web services
         * 
         */
        EdTriagePatient.build = function (concepts, data, patientDateOfBirth, patientGender, locationUuid) {

            var ret = EdTriagePatient.newInstance(data.patient.uuid, patientDateOfBirth, patientGender, locationUuid) ;
            ret.patient.display = data.patient.display;
            ret.encounterDateTime = data.encounterDatetime;
            ret.encounterUuid = data.uuid;

            //iterate through the observations and update the appropriate properties
            for (var i = 0; i < data.obs.length; ++i) {
                var uuid = data.obs[i].concept.uuid;
                var obsUuid = data.obs[i].uuid;
                var v = data.obs[i].value;

                if(obsUuid != null){
                    //we keep these, so that we can clear out a person's observations before make the other
                    // updates
                    ret.originalObservationUuids.push(obsUuid);
                }

                if (uuid == concepts.triageQueueStatus.uuid) {
                    //this concept has answers that are uuid,
                    // so you need to get the uuid instead
                    ret.triageQueueStatus = _v(v.uuid, obsUuid);
                }
                else if (uuid == concepts.triageColorCode.uuid) {
                    //the score is just the value, we convert it when we save it
                    ret.score.colorCode = v.uuid
                }
                else if (uuid == concepts.triageScore.uuid) {
                    //the score is just the value, we convert it when we save it
                    ret.score.numericScore = v;
                }
                else if (uuid == concepts.chiefComplaint.uuid) {
                    ret.chiefComplaint = _v(v, obsUuid);
                }
                else if (uuid == concepts.vitals.respiratoryRate.uuid) {
                    ret.vitals.respiratoryRate = _v(v, obsUuid);
                }
                else if (uuid == concepts.vitals.oxygenSaturation.uuid) {
                    ret.vitals.oxygenSaturation = _v(v, obsUuid);
                }
                else if (uuid == concepts.vitals.heartRate.uuid) {
                    ret.vitals.heartRate = _v(v, obsUuid);
                }
                else if (uuid == concepts.vitals.diastolicBloodPressure.uuid) {
                    ret.vitals.diastolicBloodPressure = _v(v, obsUuid);
                }
                else if (uuid == concepts.vitals.systolicBloodPressure.uuid) {
                    ret.vitals.systolicBloodPressure = _v(v, obsUuid);
                }
                else if (uuid == concepts.vitals.temperature.uuid) {
                    ret.vitals.temperature = _v(v, obsUuid);
                }
                else if (uuid == concepts.vitals.trauma.uuid) {
                    ret.vitals.trauma = _v(v, obsUuid);
                }
                else if (uuid == concepts.vitals.weight.uuid) {
                    ret.vitals.weight = _v(v, obsUuid);
                }
                else if (uuid == concepts.vitals.mobility.uuid) {
                    ret.vitals.mobility = _v(v.uuid, obsUuid);
                }
                else {
                    //there is a generic concept set uuis for symptoms (and one vital), that all the symptoms share
                    //  we need to find out which question the observation answers

                    //theck the vital that uses this
                    var found = _handleAnswerList(concepts.vitals.consciousness, v.uuid, obsUuid);
                    if(found != null){
                        ret.vitals.consciousness =  found;
                        continue;
                    }


                    for(var prop in concepts.symptoms){
                        var symptom = concepts.symptoms[prop];
                        var found = _handleAnswerList(symptom, v.uuid, obsUuid);
                        if(found){
                            ret.symptoms[prop] = found;
                            break;
                        }
                    }
                }

            }

            return ret;


            function _handleAnswerList(concept, value, obsUuid){
                for(var i = 0;i<concept.answers.length;++i){
                    var answer =  concept.answers[i];
                    if(answer.uuid == v.uuid){
                        return _v(v.uuid, obsUuid);
                    }
                }
                return null;
            }

            /* helper function to make a value object, we need the uuid for saving*/
            function _v(value, obs_id){
                return {value:value, obs_id:obs_id};
            }
        };


        /**
         * Return the constructor function
         */
        return EdTriagePatient;
    }]);