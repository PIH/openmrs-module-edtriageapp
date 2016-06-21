angular.module("edTriageDataService", [])
    .service('EdTriageDataService', ['$q', '$http', '$filter', 'EdTriageConcept', 'EdTriagePatient',
        function ($q, $http, $filter, EdTriageConcept, EdTriagePatient) {
            var CONSTANTS = {
                URLS: {
                    FIND_PATIENT: "edtriageapp/findPatient.page?appId=mirebalais.liveCheckin", //  was "coreapps/findpatient/findPatient.page?app=edtriageapp.app.edTriage";
                    CONCEPTS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/concept",
                    ENCOUNTER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter?s=getActiveEdTriageEncounters&v=full&patient=PATIENT_UUID&location=LOCATION_UUID",
                    VIEW_QUEUE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter?s=getActiveEdTriageEncounters&v=full&location=LOCATION_UUID",
                    ENCOUNTER_SAVE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter",
                    OBSERVATION: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/obs"
                },
                NONE_CONCEPT_UUID: "3cd743f8-26fe-102b-80cb-0017a47871b2",
                ED_TRIAGE_CONCEPT_UUIDS: ["123fa843-a734-40c9-910c-4fe7527427ef"] ,
                ED_TRIAGE_ENCOUNTER_TYPE: "74cef0a6-2801-11e6-b67b-9e71128cae77"
            };

            /* load a the concept definition for a ed triage patient
            * @returns {EDTriageConcpt} the concept that make up this app
            * */
            this.loadConcept = function () {
                return $http.get(CONSTANTS.URLS.CONCEPTS + '/' + CONSTANTS.ED_TRIAGE_CONCEPT_UUIDS[0] + "?v=full").then(function (resp) {
                    if (resp.status == 200) {
                        return EdTriageConcept.build(resp.data.setMembers);

                    }
                    else {
                        //don't return any concepts and let the caller handle the error
                        return null;
                    }

                }, function (err) {
                    console.log(err);
                });
            };

            /* load the EdTriageQueue for a location
             *  @param {String} locationUuid - the location uuid
             * @returns {EdTriageQueue} the concepts that make up this app
             * */
            this.loadQueue = function (concept, locationUuid) {
                var url = CONSTANTS.URLS.VIEW_QUEUE.replace("LOCATION_UUID", locationUuid);
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200) {
                        var list = resp.data.results;
                        var edTriageQueue = EdTriagePatient.buildList(concept, list, locationUuid);

                        return {status:{ code: resp.status, msg:null},data:edTriageQueue};
                    }
                    else {
                        return {status:{ code: resp.status, msg:"Error loading queue " + resp.status},data:[]};
                    }

                }, function (err) {
                    return {status:{ code: 500, msg:"Error loading queue " + err},data:[]};
                });
            };

            /* load the EdTriage encounter for this patient, if they exist, if not, then it
            *  returns an empty one with the patient and location info filled in
            *  @param {Object} concept - the concept definitions that make up this app
            *  @param {String} uuid - the patient uuid
            *  @param {Object} dateOfBirth - the patient date of birth
            *  @param {String} gender - the patient gender
            *  @param {String} locationUuid - the location uuid
            * @returns {EdTriagePatient} the concepts that make up this app
            * */
            this.load = function (concept, uuid, dateOfBirth, gender, locationUuid) {
                var url = CONSTANTS.URLS.ENCOUNTER.replace("PATIENT_UUID",uuid).replace("LOCATION_UUID", locationUuid);
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200 && resp.data.results != null && resp.data.results.length > 0) {
                        var rec = resp.data.results[0]; //should only be one records, but web service returns array for consistency
                        return EdTriagePatient.build(concept, rec, dateOfBirth, gender, locationUuid);
                    }
                    else {
                        //if there is an error or the record doesn't exist, then create a new one
                        return EdTriagePatient.newInstance(uuid,dateOfBirth, gender, locationUuid);
                    }

                }, function (err) {
                    //if we cannot get a record, then just create a new instance for now
                    return EdTriagePatient.newInstance(uuid,dateOfBirth, gender, locationUuid);
                });
            };

            /*
             saves an encounter for a patient
             * */
            this.save = function (edTriageConcept, edTriagePatient) {
                var encounter = {
                    uuid:edTriagePatient.uuid,
                    patient: edTriagePatient.patient.uuid,
                    encounterType: CONSTANTS.ED_TRIAGE_ENCOUNTER_TYPE,
                    location:edTriagePatient.location,
                    obs: []
                };

                //status related fields
                addObs(encounter.obs, edTriageConcept.triageQueueStatus.uuid, {value:EdTriageConcept.status.waitingForEvaluation});
                addObs(encounter.obs, edTriageConcept.triageScore.uuid, {value:edTriagePatient.score.numericScore});
                addObs(encounter.obs, edTriageConcept.triageColorCode.uuid, {value:edTriagePatient.score.colorCode});

                //chief complaint
                addObs(encounter.obs, edTriageConcept.chiefComplaint.uuid, edTriagePatient.chiefComplaint);

                //vitals ----
                addObs(encounter.obs, edTriageConcept.vitals.mobility.uuid, edTriagePatient.vitals.mobility);
                addObs(encounter.obs, edTriageConcept.vitals.respiratoryRate.uuid, edTriagePatient.vitals.respiratoryRate);
                addObs(encounter.obs, edTriageConcept.vitals.oxygenSaturation.uuid, edTriagePatient.vitals.oxygenSaturation);
                addObs(encounter.obs, edTriageConcept.vitals.heartRate.uuid, edTriagePatient.vitals.heartRate);
                addObs(encounter.obs, edTriageConcept.vitals.systolicBloodPressure.uuid, edTriagePatient.vitals.systolicBloodPressure);
                addObs(encounter.obs, edTriageConcept.vitals.diastolicBloodPressure.uuid, edTriagePatient.vitals.diastolicBloodPressure);
                addObs(encounter.obs, edTriageConcept.vitals.temperature.uuid, edTriagePatient.vitals.temperature);

                addObs(encounter.obs, edTriageConcept.vitals.trauma.uuid, edTriagePatient.vitals.trauma);
                addObs(encounter.obs, edTriageConcept.vitals.weight.uuid, edTriagePatient.vitals.weight);

                //this one has a set of answers tha are just observations, so just set to yes
                addObs(encounter.obs, edTriageConcept.vitals.consciousness.uuid, edTriagePatient.vitals.consciousness);

                // // symptoms  ----
                addObs(encounter.obs, edTriageConcept.symptoms.neurological.uuid, edTriagePatient.symptoms.neurological);
                addObs(encounter.obs, edTriageConcept.symptoms.burn.uuid, edTriagePatient.symptoms.burn);
                addObs(encounter.obs, edTriageConcept.symptoms.trauma.uuid, edTriagePatient.symptoms.trauma);
                addObs(encounter.obs, edTriageConcept.symptoms.digestive.uuid, edTriagePatient.symptoms.digestive);
                addObs(encounter.obs, edTriageConcept.symptoms.pregnancy.uuid, edTriagePatient.symptoms.pregnancy);
                addObs(encounter.obs, edTriageConcept.symptoms.respiratory.uuid, edTriagePatient.symptoms.respiratory);
                addObs(encounter.obs, edTriageConcept.symptoms.pain.uuid, edTriagePatient.symptoms.pain);
                addObs(encounter.obs, edTriageConcept.symptoms.other.uuid, edTriagePatient.symptoms.other);


                return removeAllOldObservations(edTriagePatient.originalObservationUuids).then(function(){
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
                                return {status:500, data:error};
                            });

                });


            };

            /* changes the status of the edtriage patient*/
            this.changeTriageQueueStatus = function(obsUuid, triageQueueStatusUuid){
                var url = CONSTANTS.URLS.OBSERVATION + "/" + obsUuid;
                var obs = {value: triageQueueStatusUuid};
                return $http.post(url, obs)
                    .then(function (data) {
                            return {status:200, data: data.data};
                        }
                        , function (error) {
                            console.log({status:500, data:error});
                            return {status:500, data:error};
                        });

            };



            /* removes all the existing observations for a patient, we need to do this before we save a patient's info
            * b/c there might be observations that were removed and it's easier to just start from scratch
            * @param {Array} list - a list of obs uuid's
             * @return {Array} the results from the delete
              * */
            function removeAllOldObservations(list) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                var removeObservation = function(obsUuid) {
                    return function(){
                        return $http({
                            url: CONSTANTS.URLS.OBSERVATION + "/" + obsUuid,
                            method: 'DELETE'
                        })
                    }
                };

                deferred.resolve();

                return list.reduce(function(promise, obsUuid){
                    return promise.then(removeObservation(obsUuid));
                }, promise);
            }
            /*
             helper function to build an observation object
             * */
            function buildObs(id, value, uuid) {
                return {concept: id, value: value};
                //return {concept: id, value: value, uuid:uuid};
            }

            /*
             * helper function to add an observation to the list
             * */
            function addObs(list, id, obs) {
                if(obs == null){
                    return;
                }

                var value = obs.value;
                var uuid = obs.uuid;


                if (id == '11111111-1111-1111-1111-111111111111') {
                    //TODO:  delete this eventually, once we have all the concepts written
                    console.log("we found a debug concept id=" + id + " so " + value + " will not be written");
                }
                else if (value == CONSTANTS.NONE_CONCEPT_UUID) {
                    //if it's none, then we don' have to put anything in there
                    console.log("ignoring " + id + "=" + value + " b/c it is none concept");
                }
                else if (value != null) {
                    console.log("will save an observation concept_uuid=" + id + " and value=" + value);
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
                var symptomsScore = {};
                symptomsScore[EdTriageConcept.score.red]=0;
                symptomsScore[EdTriageConcept.score.orange]=0;
                symptomsScore[EdTriageConcept.score.yellow]=0;
                symptomsScore[EdTriageConcept.score.green]=0;
                /*
                  for the percent complete, we calculate it like this:
                  1/3 complete for filling in complaint
                  1/3 complete for filling in at least one symptom
                  1/3 complete depending on how many vitals were entered
                */
                var totalVitals = 9;
                var totalItems = 3*totalVitals;
                var completedItems = 0;

                if(_ans(edTriagePatient.chiefComplaint)){
                    completedItems += totalVitals;
                }
                //iterate through the vitals and ...
                // 1) check that they are entered
                // 2) update the score based on the vital
                var ageType = edTriagePatient.patient.ageType;
                var individualScores = {};
                for (var prop in edTriagePatient.vitals) {
                    if (edTriagePatient.vitals.hasOwnProperty(prop)) {
                        var p =  edTriagePatient.vitals[prop];
                        if(_ans(p)){
                            ++completedItems;
                            //TODO:  need to calc the score based on the rules for each vital
                            if(concept.vitals.hasOwnProperty(prop)){
                                var c = concept.vitals[prop];
                                if(c.hasOwnProperty("answers")){
                                    var answers = concept.vitals[prop].answers;
                                    for(var i=0;i<answers.length;++i){
                                        if(answers[i].uuid == p.value){
                                            //this is the answer that they chose
                                            individualScores[answers[i].uuid] = answers[i].score(edTriagePatient.patient.ageType, p.value);
                                            vistalsScore = vistalsScore + individualScores[answers[i].uuid];
                                            break;
                                        }
                                    }
                                }
                                else{
                                    //this kind of value doesn't have a look up value, so we check if it has a scoring
                                    // function, if it does then call it, otherwise move on
                                    if(typeof c.score === "function"){
                                        individualScores[c.uuid] = c.score(ageType, p.value);
                                        vistalsScore = vistalsScore + individualScores[c.uuid];
                                    }
                                }
                            }
                            else{
                                console.log("Concept doesn't have the property called - " + prop);
                            }

                        }
                    }
                }
                if(vistalsScore > 6){
                    ++symptomsScore[EdTriageConcept.score.red];
                }
                else if(vistalsScore > 4){
                    ++symptomsScore[EdTriageConcept.score.orange];
                }
                else if(vistalsScore > 2){
                    ++symptomsScore[EdTriageConcept.score.yellow];
                }


                // 1) check that they are entered
                // 2) update the score based on the symptom
                var haveAtLeastOneSymptom = false;
                for (var prop in edTriagePatient.symptoms) {
                    if (edTriagePatient.symptoms.hasOwnProperty(prop)) {
                        var p =  edTriagePatient.symptoms[prop];
                        if(_ans(p)){
                            haveAtLeastOneSymptom = true;
                            var answers = concept.symptoms[prop].answers;
                            for(var i=0;i<answers.length;++i){
                                if(answers[i].uuid == p.value){
                                    console.log("symptoms score is " + answers[i].score(edTriagePatient.patient.ageType, p.value));
                                    individualScores[p.value] = answers[i].score(edTriagePatient.patient.ageType, p.value);
                                    ++symptomsScore[individualScores[p.value]];
                                    break;
                                }
                            }
                        }
                    }
                }
                if(haveAtLeastOneSymptom){
                    completedItems += totalVitals;
                }


                // the scoring works like this:
                //  if you have at least one red, then your
                // color is red, then on down for the other
                // priorities.  the numeric score is not used, but 
                // could be used for scoring
                var colorCode = EdTriageConcept.score.green;
                var numericScore = 0;
                if(symptomsScore[EdTriageConcept.score.red]>0){
                    colorCode = EdTriageConcept.score.red;
                    numericScore =  symptomsScore[EdTriageConcept.score.red]*20;
                }
                else if(symptomsScore[EdTriageConcept.score.orange]>0){
                    colorCode = EdTriageConcept.score.orange;
                    numericScore =  symptomsScore[EdTriageConcept.score.orange]*5;
                }
                else if(symptomsScore[EdTriageConcept.score.yellow]>0){
                    colorCode = EdTriageConcept.score.yellow;
                    numericScore =  symptomsScore[EdTriageConcept.score.yellow];
                }

                var score = {colorCode: colorCode, numericScore:numericScore, individualScores:individualScores, vitalsScore:vistalsScore};
                edTriagePatient.score = score;
                edTriagePatient.percentComplete = Math.round(completedItems / totalItems * 100);

                return score;

                function _ans(v){
                    return v != null && ((typeof v == 'string')?v.length>0:true);
                }
            };

            this.CONSTANTS = CONSTANTS;
        }]);