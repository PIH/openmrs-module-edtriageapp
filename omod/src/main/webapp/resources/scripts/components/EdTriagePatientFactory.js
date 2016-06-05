angular.module("edTriagePatientFactory", [])
    .factory('EdTriagePatient', ['$filter', function ($filter) {

        /**
         * Constructor, with class name
         */
        function EdTriagePatient() {
            this.uuid = null;
            this.triageQueueStatus = null;
            this.score = 0;
            this.percentComplete = 0;
            this.patient = {uuid:null, age:null, birthdate:null, gender:null, ageType:null};
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
            var age = 12 ; //TODO: calc the real age
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

        /**
         * Static method, assigned to class
         * Instance ('this') is not available in static context
         */
        EdTriagePatient.build = function (concepts, data, patientUuid, patientDateOfBirth, patientGender, locationUuid) {

            var ret = EdTriagePatient.newInstance(patientUuid, patientDateOfBirth, patientGender, locationUuid) ;
            ret.uuid = data.uuid;
            ret.score = 0;
            ret.percentComplete = 0;
            //ret.patient = {uuid:data.patient.uuid, age:null, birthdate:null, gender:null, ageType:null};
            //ret.location = data.location;

            for (var i = 0; i < data.obs.length; ++i) {
                var uuid = data.obs[i].concept.uuid;
                var v = data.obs[i].value;
                if (uuid == concepts.triageQueueStatus.uuid) {
                    ret.triageQueueStatus = v;
                }
                else if (uuid == concepts.chiefComplaint.uuid) {
                    ret.chiefComplaint = v;
                }
                else if (uuid == concepts.vitals.respiratoryRate.uuid) {
                    ret.vitals.respiratoryRate = v;
                }
                else if (uuid == concepts.vitals.oxygenSaturation.uuid) {
                    ret.vitals.oxygenSaturation = v;
                }
                else if (uuid == concepts.vitals.heartRate.uuid) {
                    ret.vitals.heartRate = v;
                }
                else if (uuid == concepts.vitals.diastolicBloodPressure.uuid) {
                    ret.vitals.diastolicBloodPressure = v;
                }
                else if (uuid == concepts.vitals.systolicBloodPressure.uuid) {
                    ret.vitals.systolicBloodPressure = v;
                }
                else if (uuid == concepts.vitals.temperature.uuid) {
                    ret.vitals.temperature = v;
                }
                else if (uuid == concepts.vitals.trauma.uuid) {
                    ret.vitals.trauma = v;
                }
                else if (uuid == concepts.vitals.weight.uuid) {
                    ret.vitals.weight = v;
                }
                else {
                    var lookups = [{o: 'vitals', c: 'mobility', p: 'mobility'},
                        {o: 'vitals', c: 'consciousness', p: 'consciousness'},
                        {o: 'symptoms', c: 'neurological', p: 'neurological'},
                        {o: 'symptoms', c: 'burn', p: 'burn'},
                        {o: 'symptoms', c: 'trauma', p: 'trauma'},
                        {o: 'symptoms', c: 'digestive', p: 'digestive'},
                        {o: 'symptoms', c: 'pregnancy', p: 'pregnancy'},
                        {o: 'symptoms', c: 'respiratory', p: 'respiratory'},
                        {o: 'symptoms', c: 'pain', p: 'pain'},
                        {o: 'symptoms', c: 'other', p: 'other'}];
                    for (var j = 0; j < lookups.length; ++j) {
                        var ok = _updateAnswersFromUuid(concepts, ret, lookups[j], data.obs[i]);
                        if (ok) {
                            break;
                        }
                    }


                }

            }

            console.log(ret);

            return ret;
            /*
             * checks if the observation is one of a set of answers
             * @param {Array} answers - the list of answers
             * @param {String} uuid - the uuid of the observation that you are looking up
             * @return {bool} true/false
             * */
            function _updateAnswersFromUuid(concept, edTriagePatientData, lookup, obs) {
                var temp = $filter('filter')(concept[lookup.o][lookup.c].answers, {uuid: obs.uuid});
                if (temp != null && temp.length > 0) {
                    edTriagePatientData[lookup.o][lookup.p] = obs.value;
                    return true;
                }

                return false;
            }
        };


        /**
         * Return the constructor function
         */
        return EdTriagePatient;
    }]);