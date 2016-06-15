angular.module("edTriagePatientFactory", [])
    .factory('EdTriagePatient', ['$filter', 'EdTriageConcept', function ($filter, EdTriageConcept) {

        /**
         * Constructor, with class name
         */
        function EdTriagePatient() {
            this.encounterUuid = null;
            this.triageQueueStatus = null;
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
            var colorCode = this.score.colorCode.value;
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

        EdTriagePatient.prototype.waitTime = function(){
            var date = new Date(this.encounterDateTime);
            var now = new Date();
            var w = (now - date)/1000;
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
                ret.push(EdTriagePatient.build(concepts, data[i], patientDateOfBirth, patientGender, locationUuid))
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
                    ret.triageQueueStatus = _v(v);
                }
                else if (uuid == concepts.triageColorCode.uuid) {
                    ret.score.colorCode = _v(v.uuid);
                }
                else if (uuid == concepts.triageScore.uuid) {
                    ret.score.numericScore = _v(v);
                }
                else if (uuid == concepts.chiefComplaint.uuid) {
                    ret.chiefComplaint = _v(v);
                }
                else if (uuid == concepts.vitals.respiratoryRate.uuid) {
                    ret.vitals.respiratoryRate = _v(v);
                }
                else if (uuid == concepts.vitals.oxygenSaturation.uuid) {
                    ret.vitals.oxygenSaturation = _v(v);
                }
                else if (uuid == concepts.vitals.heartRate.uuid) {
                    ret.vitals.heartRate = _v(v);
                }
                else if (uuid == concepts.vitals.diastolicBloodPressure.uuid) {
                    ret.vitals.diastolicBloodPressure = _v(v);
                }
                else if (uuid == concepts.vitals.systolicBloodPressure.uuid) {
                    ret.vitals.systolicBloodPressure = _v(v);
                }
                else if (uuid == concepts.vitals.temperature.uuid) {
                    ret.vitals.temperature = _v(v);
                }
                else if (uuid == concepts.vitals.trauma.uuid) {
                    ret.vitals.trauma = _v(v);
                }
                else if (uuid == concepts.vitals.weight.uuid) {
                    ret.vitals.weight = _v(v);
                }
                else if (uuid == concepts.vitals.mobility.uuid) {
                    ret.vitals.mobility = _v(v.uuid);
                }
                else {
                }

            }

            return ret;

            /* helper function to make a value object, we need the uuid for saving*/
            function _v(value){
                return {value:value};
            }
        };


        /**
         * Return the constructor function
         */
        return EdTriagePatient;
    }]);