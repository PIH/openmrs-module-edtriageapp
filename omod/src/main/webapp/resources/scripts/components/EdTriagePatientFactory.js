angular.module("edTriagePatientFactory", [])
    .factory('EdTriagePatient', ['$filter', 'EdTriageConcept', function ($filter, EdTriageConcept, serverDateTimeInMillis) {

        /**
         * Constructor, with class name
         */
        function EdTriagePatient() {
            this.encounterUuid = null;
            this.triageQueueStatus = {value:EdTriageConcept.status.waitingForEvaluation};
            this.encounterDateTime = null;
            this.encounterProviders = null;
            this.score = {colorCode: EdTriageConcept.score.green, numericScore:0};
            this.triageWaitingTime = {value:0};
            // these two are a bit of a hack, to keep try of the obs uuids of color code and score
            this.existingColorCodeObsUuid;
            this.existingNumericScoreObsUuid;
            this.existingTriageWaitingTimeObsUuid;
            this.patient = {uuid:null, age:null, birthdate:null, gender:null, ageType:null, lessThan4WeeksOld:false, display:null};
            this.location = null;
            this.chiefComplaint = null;
            this.vitals = {
                mobility: null,
                respiratoryRate: null,
                oxygenSaturation: null,
                heartRate: null,
                diastolicBloodPressure: null,
                systolicBloodPressure: null,
                temperature: {value:null, uuid:null},
                consciousness: null,
                trauma: null,
                weight: {value:null, uuid:null}
            };
            this.symptoms = {
                emergencySigns: null,
                neurological: null,
                burn: null,
                diabetic: null,
                trauma: null,
                digestive: null,
                pregnancy: null,
                respiratory: null,
                pain: null,
                other: null,
                none: null
            };
            this.confirmNoSymptoms = false;
            this.clinicalImpression = null;
            this.labs = {
                glucose: null,
                lowGlucoseLevel: null,
                highGlucoseLevel: null,
                pregnancy: null
            };
            this.treatment = {
                oxygen: null,
                paracetamol: null,
                paracetamolDose: null
            }
        }
        /*
        * gets the html color for the code
        * */
        EdTriagePatient.prototype.getColorHtmlCode = function(){
            var ret = 'green';
            var colorCode = this.score.colorCode;
            if(colorCode == EdTriageConcept.score.blue){
                ret = "blue";
            }
            else if(colorCode == EdTriageConcept.score.red){
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

        /*
         * gets the weight for the color code
         * */
        EdTriagePatient.prototype.getColorWeight = function(){
            var ret = 4;
            var colorCode = this.score.colorCode;
            if(colorCode == EdTriageConcept.score.blue){
                ret = 1;
            }
            else if(colorCode == EdTriageConcept.score.red){
                ret = 2;
            }
            else if(colorCode == EdTriageConcept.score.orange){
                ret = 3;
            }
            else if(colorCode == EdTriageConcept.score.yellow){
                ret = 4;
            }
            else{
                ret = 5;
            }
            return ret;
        };

        /* calculates the wait time for a patient
         * @param {num} serverDateTimeDeltaInMillis - the difference between the server time and the client time
         * @return {String} the wait time */
        EdTriagePatient.prototype.waitTime = function(serverDateTimeDeltaInMillis) {
            if ( this.encounterDateTime == null ) {
                return 0;
            }
            var date = new Date(this.encounterDateTime);
            var now = new Date();
            var delta = serverDateTimeDeltaInMillis == null ? 0 : serverDateTimeDeltaInMillis;
            var waitTime = (now.getTime() - date.getTime() - delta )/1000;
            //this fixes any small differences in time, it shouldn't happen
            if(waitTime < 0){
                waitTime =0;
            }
            return Math.floor(waitTime);
        }

        /* calculates the formatted wait time for a patient
        * @param {num} serverDateTimeDeltaInMillis - the difference between the server time and the client time
        * @return {String} the formatted wait time */
        EdTriagePatient.prototype.waitTimeFormatted = function(serverDateTimeDeltaInMillis){
            var w = 0;
            if ( angular.isNumber(this.triageWaitingTime.value) &&  (Math.round(this.triageWaitingTime.value) > 0) ) {
               w =  this.triageWaitingTime.value;
            } else {
                w = this.waitTime(serverDateTimeDeltaInMillis);
            }

            var hr = Math.floor(w /60 /60);
            var mn = Math.floor((w /60) % 60);
            var sec = Math.floor(w % 60);
            return hr + ":" + (mn < 10 ? "0"+mn:mn) + ":" + (sec < 10 ? "0" + sec:sec);
        }  ;

        EdTriagePatient.prototype.isPatientDead = function () {
            return this.vitals.heartRate && this.vitals.heartRate.value == 0;
        };
        
        EdTriagePatient.prototype.areVitalsComplete = function () {
            return this.vitals.mobility && this.vitals.mobility.value &&
                this.vitals.respiratoryRate && this.vitals.respiratoryRate.value &&
                this.vitals.oxygenSaturation && this.vitals.oxygenSaturation.value &&
                this.vitals.heartRate&& this.vitals.heartRate.value &&
                ((this.vitals.diastolicBloodPressure && this.vitals.diastolicBloodPressure.value) || this.patient.ageType != 'A') &&
                ((this.vitals.systolicBloodPressure && this.vitals.systolicBloodPressure.value) || this.patient.ageType != 'A') &&
                this.vitals.temperature && this.vitals.temperature.value &&
                this.vitals.consciousness && this.vitals.consciousness.value
        };

        EdTriagePatient.prototype.atLeastOneSymptomPresent = function () {
            return (this.symptoms.emergencySigns && this.symptoms.emergencySigns.value) ||
                (this.symptoms.neurological && this.symptoms.neurological.value) ||
                (this.symptoms.burn && this.symptoms.burn.value) ||
                (this.symptoms.diabetic && this.symptoms.diabetic.value) ||
                (this.symptoms.trauma && this.symptoms.trauma.value) ||
                (this.symptoms.digestive && this.symptoms.digestive.value) ||
                (this.symptoms.pregnancy && this.symptoms.pregnancy.value) ||
                (this.symptoms.respiratory && this.symptoms.respiratory.value) ||
                (this.symptoms.pain && this.symptoms.pain.value) ||
                (this.symptoms.other && this.symptoms.other.value) ||
                this.confirmNoSymptoms
        };


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
            var fourWeeks = 1000*60*60*24*28;
            var age = Math.floor(diff/yr) ; //TODO: calc the real age
            var ageType = EdTriageConcept.ageType.ADULT;
            if(age < 3){
                ageType = EdTriageConcept.ageType.INFANT;
            }
            else if (age < 13){
                ageType = EdTriageConcept.ageType.CHILD;
            }
            ret.patient.uuid = uuid;
            ret.patient.age = age;
            ret.patient.birthdate=dateOfBirth;
            ret.patient.lessThan4WeeksOld = (diff < fourWeeks);
            ret.patient.gender=gender;
            ret.patient.age = age;
            ret.patient.ageType=ageType;
            ret.location = locationUuid;

            return ret;
        };
        /*  makes a list of triage encounters from a web service response
        * @param {EdTriageConcept} concepts - the list of concepts that define the encounter
        * @param {Array[Encounter]} data - the list of encounters from the web service
        * @param {String} locationUuid - the current location uuid
        * @return {Array[EdTriagePatient]} an array of EdTriagePatient objects
        * */
        EdTriagePatient.buildList = function (concepts, data, locationUuid) {
            //these fields are required for listing, but would be necessary, if we ran the calculate function
            //-----------------------------------------------------------------------
            var ret = [];
            for(var i = 0;i<data.length;++i){
                var patientDateOfBirth = new Date(data[i].patient.person.birthdate);
                var patientGender = data[i].patient.person.gender;
                ret.push(EdTriagePatient.build(concepts, data[i], patientDateOfBirth, patientGender, locationUuid));
            }
            return ret;
        };
        
        /**
         * builds a class from the edtriage concepts and the data from the web services
         * @param {EdTriageConcept} concepts - the list of concepts that define the encounter
         * @param {Encounter} data - an encounter from the web service
         * @param {Date} patientDateOfBirth - the patient's DOB (used for calculating the score only)
         * @param {String} patientGender - the patient gender (used for showing different questions
         * @param {String} locationUuid - the current location uuid
         * @return EdTriagePatient the EdTriagePatient object
         */
        EdTriagePatient.build = function (concepts, data, patientDateOfBirth, patientGender, locationUuid) {

            var ret = EdTriagePatient.newInstance(data.patient.uuid, patientDateOfBirth, patientGender, locationUuid) ;
            ret.patient.display = data.patient.display;
            ret.encounterDateTime = data.encounterDatetime;
            ret.encounterUuid = data.uuid;
            ret.encounterProviders = data.encounterProviders;

            //iterate through the observations and update the appropriate properties
            for (var i = 0; i < data.obs.length; ++i) {
                var uuid = data.obs[i].concept.uuid;
                var obsUuid = data.obs[i].uuid;
                var v = data.obs[i].value;

                if (uuid !== null) {
                    if (uuid == concepts.triageQueueStatus.uuid) {
                        //this concept has answers that are uuid,
                        // so you need to get the uuid instead
                        ret.triageQueueStatus = _v(v.uuid, obsUuid);
                    } else if (uuid == concepts.triageColorCode.uuid) {
                        ret.score.colorCode = v.uuid;
                        ret.existingColorCodeObsUuid = obsUuid;
                    } else if (uuid == concepts.triageScore.uuid) {
                        ret.score.numericScore = v;
                        ret.existingNumericScoreObsUuid = obsUuid;
                    } else if (uuid == concepts.triageWaitingTime.uuid) {
                        ret.triageWaitingTime = _v(v, obsUuid);
                    } else if (uuid == concepts.chiefComplaint.uuid) {
                        ret.chiefComplaint = _v(v, obsUuid);
                    } else if (uuid == concepts.vitals.respiratoryRate.uuid) {
                        ret.vitals.respiratoryRate = _v(v, obsUuid);
                    } else if (uuid == concepts.vitals.oxygenSaturation.uuid) {
                        ret.vitals.oxygenSaturation = _v(v, obsUuid);
                    } else if (uuid == concepts.vitals.heartRate.uuid) {
                        ret.vitals.heartRate = _v(v, obsUuid);
                    } else if (uuid == concepts.vitals.diastolicBloodPressure.uuid) {
                        ret.vitals.diastolicBloodPressure = _v(v, obsUuid);
                    } else if (uuid == concepts.vitals.systolicBloodPressure.uuid) {
                        ret.vitals.systolicBloodPressure = _v(v, obsUuid);
                    } else if (uuid == concepts.vitals.temperature.uuid) {
                        ret.vitals.temperature = _v(v, obsUuid);
                    } else if (uuid == concepts.vitals.weight.uuid) {
                        ret.vitals.weight = _v(v, obsUuid);
                    } else if (uuid == concepts.vitals.mobility.uuid) {
                        ret.vitals.mobility = _v(v.uuid, obsUuid);
                    } else if (uuid == concepts.clinicalImpression.uuid) {
                        ret.clinicalImpression = _v(v, obsUuid);
                    } else if (uuid == concepts.labs.glucose.uuid) {
                        ret.labs.glucose = _v(v, obsUuid);
                    } else if (uuid == concepts.labs.lowGlucoseLevel.uuid) {
                        ret.labs.lowGlucoseLevel = _v(v.uuid, obsUuid);
                    } else if (uuid == concepts.labs.highGlucoseLevel.uuid) {
                        ret.labs.highGlucoseLevel = _v(v.uuid, obsUuid);
                    } else if (uuid == concepts.labs?.pregnancy_test?.uuid) {
                        ret.labs.pregnancy_test = _v(v.uuid, obsUuid);
                    }
                    // since treatments "oxygen" and "paracetamol"
                    else if (uuid == concepts.treatment?.oxygen?.uuid && v.uuid == concepts.treatment?.oxygen?.answers[0].uuid) {
                        ret.treatment.oxygen = _v(v.uuid, obsUuid);
                    } else if (uuid == concepts.treatment?.paracetamol?.uuid && v.uuid == concepts.treatment?.paracetamol?.answers[0].uuid) {
                        ret.treatment.paracetamol = _v(v.uuid, obsUuid);
                    } else if (uuid == concepts.treatment?.paracetamolDose?.uuid) {
                        ret.treatment.paracetamolDose = _v(v, obsUuid);
                    } else {
                        //there is a generic concept set uuis for symptoms (and one vital), that all the symptoms share
                        //  we need to find out which question the observation answers

                        //theck the vital that uses this
                        var found = _handleAnswerList(concepts.vitals.consciousness, v.uuid, obsUuid);
                        if (found != null) {
                            ret.vitals.consciousness = found;
                            continue;
                        }

                        var found = _handleAnswerList(concepts.vitals.trauma, v.uuid, obsUuid);
                        if (found != null) {
                            ret.vitals.trauma = found;
                            continue;
                        }


                        for (var prop in concepts.symptoms) {
                            var symptom = concepts.symptoms[prop];
                            var found = _handleAnswerList(symptom, v.uuid, obsUuid);
                            if (found) {
                                ret.symptoms[prop] = found;
                                break;
                            }
                        }
                    }

                }
            }

            //ret.confirmNoSymptoms = !ret.atLeastOneSymptomPresent();

            return ret;

            /*
            helper function for putting an answer from a list into the triage encounter
            * */
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
            function _v(value, uuid){
                return {value:value, uuid:uuid};
            }
        };


        /**
         * Return the constructor function
         */
        return EdTriagePatient;
    }]);
