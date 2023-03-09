angular.module("edTriageDataService", [])
    .service('EdTriageDataService', ['$q', '$http', '$filter', 'SessionInfo', 'EdTriageConcept', 'EdTriagePatient', 'serverDateTimeInMillis',
        function ($q, $http, $filter, SessionInfo, EdTriageConcept, EdTriagePatient, serverDateTimeInMillis) {
            var serverTimeDelta = (new Date().getTime()) - serverDateTimeInMillis;
            var CONSTANTS = {
                URLS: {
                    FIND_PATIENT: "coreapps/findpatient/findPatient.page?app=edtriageapp.app.edTriage",
                    CONCEPTS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/concept",
                    ED_TRIAGE_FOR_ACTIVE_VISIT: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter?s=getEDTriageEncounterForActiveVisit&v=custom:(uuid,encounterDatetime,encounterProviders:(dateCreated,provider),patient,obs)&patient=PATIENT_UUID&location=LOCATION_UUID",
                    ENCOUNTER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter/ENCOUNTER_UUID?v=custom:(uuid,encounterDatetime,encounterProviders:(dateCreated,provider),patient,obs)",
                    VIEW_QUEUE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter?s=getActiveEdTriageEncounters&v=custom:(uuid,encounterDatetime,patient,obs)&location=LOCATION_UUID",
                    ENCOUNTER_SAVE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter",
                    OBSERVATION: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/obs",
                    PATIENT_DASHBOARD:"coreapps/clinicianfacing/patient.page?patientId=PATIENT_UUID&app=pih.app.clinicianDashboard",
                    ACTIVE_VISIT: "/" + OPENMRS_CONTEXT_PATH  + "/ws/rest/emrapi/activevisit"
                },
                ED_TRIAGE_CONCEPT_UUIDS: ["123fa843-a734-40c9-910c-4fe7527427ef"] ,
                ED_TRIAGE_ENCOUNTER_TYPE: "74cef0a6-2801-11e6-b67b-9e71128cae77",
                CONSULTING_CLINICIAN_ENCOUNTER_ROLE: "4f10ad1a-ec49-48df-98c7-1391c6ac7f05"
            };

            /* load a the concept definition for a ed triage patient
            * @returns {EDTriageConcpt} the concept that make up this app
            * */
            this.loadConcept = function (config) {
                return $http.get(CONSTANTS.URLS.CONCEPTS + '/' + CONSTANTS.ED_TRIAGE_CONCEPT_UUIDS[0] + "?v=full").then(function (resp) {
                    if (resp.status == 200) {
                        return EdTriageConcept.build(config, resp.data.setMembers);

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
            this.load = function (concept, patientUuid, dateOfBirth, gender, locationUuid, encounterUuid) {

                if (encounterUuid) {
                    // load specific existing encounter workflow
                    return $http.get(CONSTANTS.URLS.ENCOUNTER.replace("ENCOUNTER_UUID",encounterUuid) ).then(function (resp) {
                        if (resp.status == 200 && resp.data) {
                            return EdTriagePatient.build(concept, resp.data, dateOfBirth, gender, locationUuid);
                        }
                        // otherwise, create a new instance TODO: what should we *really* do here?
                        return EdTriagePatient.newInstance(patientUuid,dateOfBirth, gender, locationUuid);
                    });
                }
                else {
                    // search for existing matching encounter workflow
                    return $http.get(CONSTANTS.URLS.ED_TRIAGE_FOR_ACTIVE_VISIT.replace("PATIENT_UUID",patientUuid).replace("LOCATION_UUID", locationUuid)).then(function (resp) {
                        if (resp.status == 200 && resp.data.results != null && resp.data.results.length > 0) {
                            var rec = resp.data.results[0]; // search should only return one record, but web service returns array for consistency
                            if ( getTriageStatus(rec, concept) == EdTriageConcept.status.waitingForEvaluation) {
                                return EdTriagePatient.build(concept, rec, dateOfBirth, gender, locationUuid);
                            }
                        }
                        // otherwise, create a new instance
                        return EdTriagePatient.newInstance(patientUuid,dateOfBirth, gender, locationUuid);
                    }, function (err) {
                        //if we cannot get a record, then just create a new instance for now
                        return EdTriagePatient.newInstance(patientUuid,dateOfBirth, gender, locationUuid);
                    });
                }
            };

            /*
             saves an encounter for a patient
             * */

            this.save = function (edTriageConcept, edTriagePatient) {

                var encounterProvider = this.session.currentProvider ?
                    { provider: this.session.currentProvider.uuid ,
                        encounterRole: CONSTANTS.CONSULTING_CLINICIAN_ENCOUNTER_ROLE } : null;

                var encounter = {
                    patient: edTriagePatient.patient.uuid,
                    encounterType: CONSTANTS.ED_TRIAGE_ENCOUNTER_TYPE,
                    location: edTriagePatient.location,
                    obs: []
                };

                // if this is a new encounter, we include the encounter provider, if not we don't because
                // we will need (see below) to make a separate call to add an encounter provider without overwriting the existing one
                if (edTriagePatient.encounterUuid == null) {
                    encounter.encounterProviders = this.session.currentProvider ? [ encounterProvider ] : [];
                }

                var obsToDelete = [];

                //status related fields
                addObs(encounter.obs, obsToDelete, edTriageConcept.triageQueueStatus.uuid, edTriagePatient.triageQueueStatus);
                addObs(encounter.obs, obsToDelete, edTriageConcept.triageScore.uuid, {value:edTriagePatient.score.numericScore, uuid: edTriagePatient.existingNumericScoreObsUuid });
                addObs(encounter.obs, obsToDelete, edTriageConcept.triageWaitingTime.uuid, edTriagePatient.triageWaitingTime);
                addObs(encounter.obs, obsToDelete, edTriageConcept.triageColorCode.uuid, {value:edTriagePatient.score.colorCode, uuid: edTriagePatient.existingColorCodeObsUuid});

                //chief complaint
                addObs(encounter.obs, obsToDelete, edTriageConcept.chiefComplaint.uuid, edTriagePatient.chiefComplaint);

                //vitals ----
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.mobility.uuid, edTriagePatient.vitals.mobility);
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.respiratoryRate.uuid,
                    {
                        uuid: edTriagePatient.vitals.respiratoryRate ? edTriagePatient.vitals.respiratoryRate.uuid : null,
                        value: edTriagePatient.vitals.respiratoryRate ? Math.round(edTriagePatient.vitals.respiratoryRate.value) : null
                    });
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.oxygenSaturation.uuid,
                    {
                        uuid: edTriagePatient.vitals.oxygenSaturation ? edTriagePatient.vitals.oxygenSaturation.uuid : null,
                        value: edTriagePatient.vitals.oxygenSaturation ?  Math.round(edTriagePatient.vitals.oxygenSaturation.value) : null
                    });
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.heartRate.uuid,
                    {
                        uuid: edTriagePatient.vitals.heartRate ? edTriagePatient.vitals.heartRate.uuid : null,
                        value: edTriagePatient.vitals.heartRate ? Math.round(edTriagePatient.vitals.heartRate.value) : null
                    });
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.systolicBloodPressure.uuid, edTriagePatient.vitals.systolicBloodPressure);
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.diastolicBloodPressure.uuid, edTriagePatient.vitals.diastolicBloodPressure);
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.temperature.uuid, edTriagePatient.vitals.temperature);

                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.trauma.uuid, edTriagePatient.vitals.trauma);
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.weight.uuid, edTriagePatient.vitals.weight);

                //this one has a set of answers tha are just observations, so just set to yes
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.consciousness.uuid, edTriagePatient.vitals.consciousness);

                // // symptoms  ----
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.emergencySigns.uuid, edTriagePatient.symptoms.emergencySigns);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.neurological.uuid, edTriagePatient.symptoms.neurological);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.burn.uuid, edTriagePatient.symptoms.burn);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.diabetic.uuid, edTriagePatient.symptoms.diabetic);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.trauma.uuid, edTriagePatient.symptoms.trauma);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.digestive.uuid, edTriagePatient.symptoms.digestive);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.pregnancy.uuid, edTriagePatient.symptoms.pregnancy);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.respiratory.uuid, edTriagePatient.symptoms.respiratory);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.pain.uuid, edTriagePatient.symptoms.pain);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.other.uuid, edTriagePatient.symptoms.other);

                // clinical impressions
                addObs(encounter.obs, obsToDelete, edTriageConcept.clinicalImpression.uuid, edTriagePatient.clinicalImpression);

                // labs  (note ?. null checks for concepts that might not be defined in some implementations, ie Sierra Leone)
                addObs(encounter.obs, obsToDelete, edTriageConcept.labs.glucose.uuid, edTriagePatient.labs.glucose);
                addObs(encounter.obs, obsToDelete, edTriageConcept.labs.lowGlucoseLevel.uuid, edTriagePatient.labs.lowGlucoseLevel);
                addObs(encounter.obs, obsToDelete, edTriageConcept.labs.highGlucoseLevel.uuid, edTriagePatient.labs.highGlucoseLevel);
                addObs(encounter.obs, obsToDelete, edTriageConcept.labs?.pregnancy_test?.uuid, edTriagePatient.labs.pregnancy_test);

                // treatment (note ?. null checks for concepts that might not be defined in some implementations, ie Sierra Leone)
                addObs(encounter.obs, obsToDelete, edTriageConcept.treatment?.oxygen?.uuid, edTriagePatient.treatment.oxygen);
                addObs(encounter.obs, obsToDelete, edTriageConcept.treatment?.paracetamol?.uuid, edTriagePatient.treatment.paracetamol);
                addObs(encounter.obs, obsToDelete, edTriageConcept.treatment?.paracetamolDose?.uuid,
                    {
                        uuid: edTriagePatient.treatment.paracetamolDose ? edTriagePatient.treatment.paracetamolDose.uuid : null,
                        value: edTriagePatient.treatment.paracetamolDose ? Math.floor(edTriagePatient.treatment.paracetamolDose.value) : null
                    });

                return ensureActiveVisit(edTriagePatient)
                    .then(function () {
                        return saveEncounter(encounter, edTriagePatient.encounterUuid)
                    })
                    .then(function() {
                        if (edTriagePatient.encounterUuid != null) {
                            // add new provider to existing encounter
                            return saveEncounterProvider(encounterProvider, edTriagePatient.encounterUuid);
                        }
                    })
                    .then(function () {
                        return deleteObs(obsToDelete)
                    })
                    // TODO better error handling here?
                    .then(function () {
                            return {status: 200};
                        }
                        , function (error) {
                            return {status: 500, error: error};
                        });
            };

            /*
             * the changes the status of the observation to consult
             * */
            this.beginConsult = function (edTriageConcept, edTriagePatient) {
                edTriagePatient.triageQueueStatus.value = EdTriageConcept.status.outpatientConsultation;
                edTriagePatient.triageWaitingTime.value = edTriagePatient.waitTime(serverTimeDelta);
                return this.save(edTriageConcept,edTriagePatient);
            };

            this.leftWithoutBeingSeen = function (edTriageConcept, edTriagePatient) {
                edTriagePatient.triageQueueStatus.value = EdTriageConcept.status.leftWithoutBeingSeen;
                edTriagePatient.triageWaitingTime.value = edTriagePatient.waitTime(serverTimeDelta);
                return this.save(edTriageConcept,edTriagePatient);
            };

            /*
             * the changes the status of the observation to consult
             * */
            this.removeConsult = function (edTriageConcept, edTriagePatient) {
                edTriagePatient.triageQueueStatus.value = EdTriageConcept.status.removed;
                edTriagePatient.triageWaitingTime.value = edTriagePatient.waitTime(serverTimeDelta);
                return this.save(edTriageConcept,edTriagePatient);
            };

            function ensureActiveVisit(edTriagePatient) {
                return $http.post(CONSTANTS.URLS.ACTIVE_VISIT + "?patient=" + edTriagePatient.patient.uuid + "&location=" + edTriagePatient.location);
            }
            
            function getTriageStatus(encounter, concept) {
                var status = null;
                if (encounter && encounter.obs) {
                    for (var i = 0; i < encounter.obs.length; ++i) {
                        var uuid = encounter.obs[i].concept.uuid;
                        var v = encounter.obs[i].value;
                        if (uuid == concept.triageQueueStatus.uuid) {
                            status = v.uuid;
                        }
                    }
                }
                return status;
            }

            function saveEncounter(encounter, existingUuid) {
                var url = CONSTANTS.URLS.ENCOUNTER_SAVE;

                if(existingUuid != null){
                    //if the encounte already exists, then append the UUID and it will update it
                    url +=   "/" + existingUuid;
                    encounter['uuid'] = existingUuid;
                }

                return $http.post(url, encounter);
            }

            function saveEncounterProvider(encounterProvider, existingEncounterUuid) {
                var url = CONSTANTS.URLS.ENCOUNTER_SAVE + '/' + existingEncounterUuid + '/encounterprovider';
                return $http.post(url, encounterProvider);
            }

            function deleteObs(list) {
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
            function buildObs(concept, value, uuid) {
                //return {concept: id, value: value};
                return {concept: concept, value: value, uuid:uuid};
            }

            /*
             * helper function to add an observation to the list
             * */
            function addObs(obsList, obsToDeleteList, concept, obs) {
                if(obs == null || concept == null){
                    return;
                }

                var value = obs.value;
                var uuid = obs.uuid;

                if (typeof value == 'number' && value == 0 &&
                    ( concept == EdTriageConcept.numericScore ||
                    concept == EdTriageConcept.heartRate || concept == EdTriageConcept.respiratoryRate || concept == EdTriageConcept.oxygenSaturation)) {
                    obsList.push(buildObs(concept, value, uuid));
                }
                else if (value == null || value == false || (typeof value == 'string' && value.length==0)) {
                    if (uuid != null) {
                        obsToDeleteList.push(uuid);
                    }
                }
                else{
                    obsList.push(buildObs(concept, value, uuid));
                }

            }


            this.delete = function (edTriagePatient) {
                $http.delete(url + edTriagePatient.patientId);
            };

            this.update = function (edTriagePatient) {
                $http.put(url + edTriagePatient.patientId, this);
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

                var numericScore = 0;
                var colorScores = {};
                colorScores[EdTriageConcept.score.blue]=0;
                colorScores[EdTriageConcept.score.red]=edTriagePatient.patient.lessThan4WeeksOld?1:0;
                colorScores[EdTriageConcept.score.orange]=0;
                colorScores[EdTriageConcept.score.yellow]=0;
                colorScores[EdTriageConcept.score.green]=0;

                //iterate through the vitals and ...
                // 1) check that they are entered
                // 2) update the score based on the vital
                var ageType = edTriagePatient.patient.ageType;
                var individualScores = {};
                for (var prop in edTriagePatient.vitals) {
                    if (edTriagePatient.vitals.hasOwnProperty(prop)) {
                        var p =  edTriagePatient.vitals[prop];
                        if(_ans(p)){
                            if(concept.vitals.hasOwnProperty(prop)){
                                var c = concept.vitals[prop];
                                if(c.hasOwnProperty("answers")){
                                    var answers = concept.vitals[prop].answers;
                                    for(var i=0;i<answers.length;++i){
                                        if(answers[i].uuid == p.value){
                                            //this is the answer that they chose
                                            individualScores[answers[i].uuid] = answers[i].score(edTriagePatient.patient.ageType, p.value);
                                            numericScore = numericScore + individualScores[answers[i].uuid].numericScore;
                                            break;
                                        }
                                    }
                                }
                                else{
                                    //this kind of value doesn't have a look up value, so we check if it has a scoring
                                    // function, if it does then call it, otherwise move on
                                    if(typeof c.score === "function"){
                                        individualScores[c.uuid] = c.score(ageType, p.value);
                                        numericScore = numericScore + individualScores[c.uuid].numericScore
                                        ++colorScores[individualScores[c.uuid].colorCode];
                                    }
                                }
                            }
                            else{
                                console.log("Concept doesn't have the property called - " + prop);
                            }

                        }
                    }
                }
                if(numericScore > 6){
                    ++colorScores[EdTriageConcept.score.red];
                }
                else if(numericScore > 4){
                    ++colorScores[EdTriageConcept.score.orange];
                }
                else if(numericScore > 2){
                    ++colorScores[EdTriageConcept.score.yellow];
                }


                // 1) check that they are entered
                // 2) update the score based on the symptom
                for (var prop in edTriagePatient.symptoms) {
                    if (edTriagePatient.symptoms.hasOwnProperty(prop)) {
                        var p =  edTriagePatient.symptoms[prop];
                        if(_ans(p)){
                            var answers = concept.symptoms[prop].answers;
                            for(var i=0;i<answers.length;++i){
                                if(answers[i].uuid == p.value){
                                    var sc = answers[i].score(edTriagePatient.patient.ageType, p.value);
                                    individualScores[p.value] = sc;
                                    ++colorScores[individualScores[p.value].colorCode];

                                    //add any stuff for special property handling
                                    /*
                                    if(prop == 'trauma' && p.value != null){
                                        //when you select a trauma, you need to set the vitals trauma to true
                                        var traumaObj = concept.vitals.trauma;
                                        var traumaAnwser = traumaObj.answers[0];
                                        var traumaVal =  traumaAnwser.score(edTriagePatient.patient.ageType, true);
                                        individualScores[traumaObj.uuid] = traumaVal;
                                        numericScore = numericScore + individualScores[traumaObj.uuid].numericScore;

                                    }
                                    */
                                    break;
                                }
                            }
                        }
                    }
                }

                for (var prop in edTriagePatient.labs) {
                    if (edTriagePatient.labs.hasOwnProperty(prop)) {
                        var p = edTriagePatient.labs[prop];
                        if (_ans(p)) {
                            if (concept.labs.hasOwnProperty(prop)){
                                var c = concept.labs[prop];
                                if (c.uuid == concept.labs.glucose.uuid ) {
                                    var hyperglycemiaUuid = concept.symptoms.diabetic.answers[0].uuid;
                                    if(typeof c.score === "function"){
                                        var sc = c.score(edTriagePatient.patient.ageType, p.value);
                                        individualScores[c.uuid] = sc;
                                        // UHM-2531
                                        if ( edTriagePatient.patient.ageType !== EdTriageConcept.ageType.INFANT) {
                                            if (individualScores[hyperglycemiaUuid] !== undefined ) {
                                                if ( (p.value > 200) && (p.value <= 450)) {
                                                    sc = { numericScore: 0, colorCode: EdTriageConcept.score.orange };
                                                }
                                            }
                                        }
                                        individualScores[c.uuid] = sc;
                                        individualScores[hyperglycemiaUuid] = sc;
                                        ++colorScores[individualScores[c.uuid].colorCode];
                                    }
                                } else if (c.uuid == concept.labs.lowGlucoseLevel.uuid || c.uuid == concept.labs.highGlucoseLevel.uuid) {
                                    var answers = concept.labs[prop].answers;
                                    for(var i=0;i<answers.length;++i){
                                        if(answers[i].uuid == p.value){
                                            //this is the answer that they chose
                                            individualScores[concept.labs.glucose.uuid] = answers[i].score(edTriagePatient.patient.ageType, p.value);
                                            numericScore = numericScore + individualScores[concept.labs.glucose.uuid].numericScore;
                                            ++colorScores[individualScores[concept.labs.glucose.uuid].colorCode];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // the scoring works like this:
                //  if you have at least one red, then your
                // color is red, then on down for the others
                var colorCode = EdTriageConcept.score.green;
                if (colorScores[EdTriageConcept.score.blue] > 0) {
                    colorCode = EdTriageConcept.score.blue;
                }
                else if (colorScores[EdTriageConcept.score.red] > 0) {
                    colorCode = EdTriageConcept.score.red;
                }
                else if (colorScores[EdTriageConcept.score.orange] > 0) {
                    colorCode = EdTriageConcept.score.orange;
                }
                else if(colorScores[EdTriageConcept.score.yellow] > 0) {
                    colorCode = EdTriageConcept.score.yellow;
                }

                var score = {colorCode: colorCode, numericScore:numericScore, individualScores:individualScores};
                edTriagePatient.score = score;

                return score;

                function _ans(v){
                    return v != null && ((typeof v == 'string')?v.length>0:true);
                }
            };

            /* helper function to get the color class for the score
             * @param {String} colorCode - the uuid for the color
             * @return the class suffix
             * */
            this.getColorClass = function(colorCode){
                var ret = null;
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
                else if(colorCode == EdTriageConcept.score.green){
                    ret = "green";
                }
                return ret;
            };


            this.CONSTANTS = CONSTANTS;
            this.serverTimeDelta = serverTimeDelta;
            this.session =  SessionInfo.get();
        }]);
