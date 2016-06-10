angular.module("edTriageService", [])
    .service('PatientService', ['$http', '$filter', 'EncounterTypes', 'Concepts', 'EdTriageConcept', 'EdTriagePatient',
        function ($http, $filter, EncounterTypes, Concepts, EdTriageConcept, EdTriagePatient) {
            var CONSTANTS = {
                URLS: {
                    CONCEPTS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/concept",
                    ENCOUNTER_MOCK: "/" + OPENMRS_CONTEXT_PATH + "/ms/uiframework/resource/edtriageapp/scripts/mock_data/patient_id_",
                    ENCOUNTER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter?s=getActiveEdTriageEncounters&v=full&patient=PATIENT_UUID&location=LOCATION_UUID",
                    ENCOUNTER_SAVE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter"
                },
                NONE_CONCEPT_UUID: "3cd743f8-26fe-102b-80cb-0017a47871b2",
                ED_TRIAGE_CONCEPT_SET_UUID: "80c8b161-a871-42db-a1ca-185095a1d798",
                //defines an empty value, so that we can tell if the form has been filled out
                EMPTY_VALUES: {NUM: "", STR: ""},
                // defined the different kinds of patients that we can see, adult/child/infant
                // this information determines what the form will look like
                PATIENT_TYPES: {
                    Adult: {id: 'A', descriptionKey: 'edtriage.adult.text'},
                    Child: {id: 'C', descriptionKey: 'edtriage.child.text'},
                    Infant: {id: 'I', descriptionKey: 'edtriage.infant.text'}
                }
            };

            /* load a the concept definition for a ed triage patient
            * @returns {EDTriageConcpt} the concept that make up this app
            * */
            this.loadConcept = function () {
                return $http.get(CONSTANTS.URLS.CONCEPTS + '/' + CONSTANTS.ED_TRIAGE_CONCEPT_SET_UUID).then(function (resp) {
                    if (resp.status == 200) {
                        //console.log(resp.data);

                        return EdTriageConcept.build(resp.data.setMembers);

                    }
                    else {
                        //TODO: how to handle these errors
                    }

                }, function (err) {
                    console.log(err);
                });
            };

            /* load the EdTriage encounter for this patient, if they exist, if not, then it
            *  returns an empty one with the patient and location info filled in
            *  @param {Object} concept - the concept definitions that make up this app
            *  @param {String} uuid - the patient uuid
            *  @param {Object} dateOfBirth - the patient date of birth
            *  @param {String} gender - the patient gender
            *  @param {String} locationUuid - the location uuid
            * @returns {EDTriageConcpt} the concepts that make up this app
            * */
            this.load = function (concept, uuid, dateOfBirth, gender, locationUuid) {
                var url = CONSTANTS.URLS.ENCOUNTER.replace("PATIENT_UUID",uuid).replace("LOCATION_UUID", locationUuid);
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200 && resp.data.results != null && resp.data.results.length > 0) {
                        var rec = resp.data.results[0]; //should only be one records, but web service returns array for consistency
                        return EdTriagePatient.build(concept, rec, uuid, dateOfBirth, gender, locationUuid);
                    }
                    else {
                        //if there is an error or the record doesn't exist, then create a new one
                        return EdTriagePatient.newInstance(uuid,dateOfBirth, gender, locationUuid);
                    }

                }, function (err) {
                    //TODO: for now we load an empty record, b/c we are using mock data,
                    // but we need to handle this another way
                    return EdTriagePatient.newInstance(uuid,dateOfBirth, gender, locationUuid);
                });
            };

            /*
             saves an encounter for a patient
             * */
            this.save = function (edTriagePatient) {
                var encounter = {
                    uuid:edTriagePatient.uuid,
                    patient: edTriagePatient.patient.uuid,
                    encounterType: EncounterTypes.triage.uuid,
                    location:edTriagePatient.location,
                    obs: []
                };

                //status
                //addObs(encounter.obs, Concepts.triageQueueStatus.uuid, edTriagePatient.status);

                //chief complaint
                addObs(encounter.obs, Concepts.chiefComplaint.uuid, edTriagePatient.chiefComplaint);

                //vitals ----
                addObs(encounter.obs, Concepts.mobility.uuid, edTriagePatient.vitals.mobility);
                addObs(encounter.obs, Concepts.respiratoryRate.uuid, edTriagePatient.vitals.respiratoryRate);
                addObs(encounter.obs, Concepts.oxygenSaturation.uuid, edTriagePatient.vitals.oxygenSaturation);
                addObs(encounter.obs, Concepts.heartRate.uuid, edTriagePatient.vitals.heartRate);
                addObs(encounter.obs, Concepts.systolicBloodPressure.uuid, edTriagePatient.vitals.systolicBloodPressure);
                addObs(encounter.obs, Concepts.diastolicBloodPressure.uuid, edTriagePatient.vitals.diastolicBloodPressure);
                addObs(encounter.obs, Concepts.temperature.uuid, edTriagePatient.vitals.temperature);
                addObs(encounter.obs, Concepts.consciousness.uuid, edTriagePatient.vitals.consciousness);
                addObs(encounter.obs, Concepts.trauma.uuid, edTriagePatient.vitals.trauma);
                addObs(encounter.obs, Concepts.weight.uuid, edTriagePatient.vitals.weight);

                // // symptoms  ----
                // addObs(encounter.obs, Concepts.weight.uuid, edTriagePatient.symptoms.neurological);
                // addObs(encounter.obs, Concepts.burn.uuid, edTriagePatient.symptoms.burn);
                // addObs(encounter.obs, Concepts.traumaDetails.uuid, edTriagePatient.symptoms.traumaDetails);
                // addObs(encounter.obs, Concepts.digestive.uuid, edTriagePatient.symptoms.digestive);
                // addObs(encounter.obs, Concepts.pregnancy.uuid, edTriagePatient.symptoms.pregnancy);
                // addObs(encounter.obs, Concepts.respiratory.uuid, edTriagePatient.symptoms.respiratory);
                // addObs(encounter.obs, Concepts.pain.uuid, edTriagePatient.symptoms.pain);
                // addObs(encounter.obs, Concepts.other.uuid, edTriagePatient.symptoms.other);


                console.log("About to save an encounter...");
                console.log(encounter);
                
                var url = CONSTANTS.URLS.ENCOUNTER_SAVE;
                if(edTriagePatient.encounterUuid != null){
                    //if the encounte already exists, then append the UUID and it will update it
                    url +=   "/" + edTriagePatient.encounterUuid;
                }

                return $http.post(url, encounter)
                    .then(function (data) {
                            return {status:200, data: data.data};
                        }
                        , function (error) {
                            console.log({status:500, data:error});
                            return error;
                        });

            };

            /*
             helper function to build an observation object
             * */
            function buildObs(id, value, uuid) {
                return {concept: id, value: value, uuid:uuid};
            }

            /*
             * helper function to add an observation to the list
             * */
            function addObs(list, id, obs) {
                if(obs == null){
                    //TODO:  we need to delete this observation if it already was saved
                    return;
                }

                var value = obs.value;
                var uuid = obs.uuid;

                console.log(id + "=" + CONSTANTS.NONE_CONCEPT_UUID + " == " + (id == CONSTANTS.NONE_CONCEPT_UUID));
                if (id == '11111111-1111-1111-1111-111111111111') {
                    //TODO:  delete this eventually, once we have all the concepts written
                    console.log("we found a debug concept id=" + id + " so " + value + " will not be written");
                }
                else if (value == CONSTANTS.NONE_CONCEPT_UUID) {
                    //if it's none, then we don' have to put anything in there
                    console.log("ignoring " + id + "=" + value + " b/c it is none concept");
                }
                else if (value != null) {
                    list.push(buildObs(id, value, uuid));
                }

            }


            this.delete = function (edTriagePatient) {
                $http.delete(url + edTriagePatient.patientId);
            };

            this.update = function (edTriagePatient) {
                $http.put(url + edTriagePatient.patientId, this);
            };

            this.canSave = function (edTriagePatient) {
                return !!(edTriagePatient.patientId || edTriagePatient.patientId > 0);

            };

            /*
             * calculates a patient's score
             * @param {EDTriageConcpt} the concept that make up this app
             * @param {EdTriagePatient} edTriagePatient - the patient info
             * @return {int} the score
             * */
            this.calculate = function (concept, edTriagePatient) {
                if(edTriagePatient == null){
                    return;
                }

                var vistalsScore = 0;
                var symptomsScore = [0,0,0,0];
                var totalItems = 17;
                var completedItems = 0;

                if(_ans(edTriagePatient.chiefComplaint)){
                    ++completedItems;
                }
                //iterate through the vitals and ...
                // 1) check that they are entered
                // 2) update the score based on the vital
                for (var prop in edTriagePatient.vitals) {
                    if (edTriagePatient.vitals.hasOwnProperty(prop)) {
                        var p =  edTriagePatient.vitals[prop];
                        if(_ans(p)){
                            ++completedItems;
                            //TODO:  need to calc the score based on the rules for each vital
                            ++vistalsScore;
                        }
                    }
                }

                //iterate through the vitals and ...
                // 1) check that they are entered
                // 2) update the score based on the symptom
                for (var prop in edTriagePatient.symptoms) {
                    if (edTriagePatient.vitals.hasOwnProperty(prop)) {
                        var p =  edTriagePatient.vitals[prop];
                        if(_ans(p)){
                            ++completedItems;
                            //if a symptom is entered, then we need to look up the score for this symptom and increment it
                            var t = EdTriageConcept.findAnswer(concept, p.uuid);
                            if(t != null){
                                if(t.score != null){
                                   ++symptomsScore[t.score];
                                }
                            }
                        }
                    }
                }

                var overallScore = 'Green';
                if(vistalsScore > 6 || symptomsScore[EdTriageConcept.score.red]>0){
                    overallScore = 'Red';
                }
                else if(vistalsScore > 4 || symptomsScore[EdTriageConcept.score.orange]>0){
                    overallScore = 'Orange';
                }
                else if(vistalsScore > 2 || symptomsScore[EdTriageConcept.score.yellow]>0){
                    overallScore = 'Yellow';
                }

                var score = {overall: overallScore, vitals:vistalsScore, symptoms:symptomsScore};
                edTriagePatient.score = score;
                edTriagePatient.percentComplete = Math.round(completedItems / totalItems * 100);

                return score;

                function _ans(v){
                    return v != null && ((typeof v == 'string')?v.length>0:true);
                }
            };

            this.CONSTANTS = CONSTANTS;
        }]);