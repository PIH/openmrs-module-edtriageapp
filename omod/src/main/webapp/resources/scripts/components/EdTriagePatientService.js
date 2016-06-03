angular.module("edTriageService", [])
    .service('PatientService', ['$http', 'EncounterTypes', 'Concepts', 'EdTriageConcept',function($http, EncounterTypes, Concepts, EdTriageConcept) {
    var CONSTANTS = {
        URLS:{
             CONCEPTS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/concept",
             ENCOUNTER: "/" + OPENMRS_CONTEXT_PATH + "/ms/uiframework/resource/edtriageapp/scripts/mock_data/patient_id_"
             //ENCOUNTER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter"
        }   ,
        NONE_CONCEPT_UUID :  "3cd743f8-26fe-102b-80cb-0017a47871b2",
        ED_TRIAGE_CONCEPT_SET_UUID :  "80c8b161-a871-42db-a1ca-185095a1d798",
        //defines an empty value, so that we can tell if the form has been filled out
        EMPTY_VALUES:{NUM:"", STR:""},
        // defined the different kinds of patients that we can see, adult/child/infant
        // this information determines what the form will look like
        PATIENT_TYPES:{
            Adult:{id:'A', descriptionKey:'edtriage.adult.text'},
            Child:{id:'C', descriptionKey:'edtriage.child.text'},
            Infant:{id:'I', descriptionKey:'edtriage.infant.text'}
        }
    };

    this.loadConcept = function(){
        return $http.get(CONSTANTS.URLS.CONCEPTS + '/' + CONSTANTS.ED_TRIAGE_CONCEPT_SET_UUID).then(function(resp) {
            if(resp.status == 200){
                //console.log(resp.data);

                return  EdTriageConcept.build(resp.data.setMembers);

            }
            else{
                //TODO: how to handle these errors
            }

        }, function(err){
            console.log(err);
        });
    }
        
        

    this.load = function(id) {
        return $http.get(CONSTANTS.URLS.ENCOUNTER + id + '.json').then(function(resp) {
            if(resp.status == 200){
                return resp.data;
            }
            else{
                //TODO: how to handle these errors
             }

        }, function(err){
            return createNewEdTriageRecord(id);
        });
    };

    /*
    saves an encounter for a patient
    * */
    this.save = function(edTriagePatient) {
        var encounter = {
            patient: edTriagePatient.patientId,
            encounterType: EncounterTypes.triage,
            obs: []
        };

        //status
        addObs(encounter.obs, Concepts.triageQueueStatus.uuid, edTriagePatient.complaint);

        //chief complaint
        addObs(encounter.obs, Concepts.chiefComplaint.uuid, edTriagePatient.complaint);

        //vitals ----
        addObs(encounter.obs, Concepts.mobility.uuid, edTriagePatient.vitals.mobility);
        addObs(encounter.obs, Concepts.respiratoryRate.uuid, edTriagePatient.vitals.respiratoryRate);
        addObs(encounter.obs, Concepts.oxygenSaturation.uuid, edTriagePatient.vitals.oxygenSaturation);
        addObs(encounter.obs, Concepts.systolicBloodPressure.uuid, edTriagePatient.vitals.bloodPressure.systolic);
        addObs(encounter.obs, Concepts.diastolicBloodPressure.uuid, edTriagePatient.vitals.bloodPressure.diastolic);
        addObs(encounter.obs, Concepts.temperature.uuid, edTriagePatient.vitals.temperature);
        addObs(encounter.obs, Concepts.consciousness.uuid, edTriagePatient.vitals.consciousness);
        addObs(encounter.obs, Concepts.trauma.uuid, edTriagePatient.vitals.trauma);
        addObs(encounter.obs, Concepts.weight.uuid, edTriagePatient.vitals.weight);

        // symptoms  ----
        addObs(encounter.obs, Concepts.weight.uuid, edTriagePatient.symptoms.neurological);
        addObs(encounter.obs, Concepts.burn.uuid, edTriagePatient.symptoms.burn);
        addObs(encounter.obs, Concepts.traumaDetails.uuid, edTriagePatient.symptoms.traumaDetails);
        addObs(encounter.obs, Concepts.digestive.uuid, edTriagePatient.symptoms.digestive);
        addObs(encounter.obs, Concepts.pregnancy.uuid, edTriagePatient.symptoms.pregnancy);
        addObs(encounter.obs, Concepts.respiratory.uuid, edTriagePatient.symptoms.respiratory);
        addObs(encounter.obs, Concepts.pain.uuid, edTriagePatient.symptoms.pain);
        addObs(encounter.obs, Concepts.other.uuid, edTriagePatient.symptoms.other);


        $http.post(CONSTANTS.URLS.ENCOUNTER,
            encounter)
            .success(function() {
                window.alert("Saved!");
            })
            .error(function(error) {
                console.log(error);
                window.alert("Error");
            });

    };

    /*
    helper function to build an observation object
    * */
    function buildObs(id, value){
        return { concept: id, value: value };
    }
    /*
    * helper function to add an observation to the list
    * */
    function addObs(list, id, value){
        if(id == '11111111-1111-1111-1111-111111111111'){
            //TODO:  delete this eventually, once we have all the concepts written
            console.log("we found a debug concept id=" + id + " so " + value + " will not be written");
        }
        else if (value != null && value.length > 0){
            list.push(buildObs(id, value));    
        }
        
    }


    this.delete = function(edTriagePatient) {
        $http.delete(url + edTriagePatient.patientId);
    };

    this.update = function(edTriagePatient) {
        $http.put(url + edTriagePatient.patientId, this);
    };

    this.canSave =  function(edTriagePatient) {
        return !!(edTriagePatient.patientId || edTriagePatient.patientId > 0);

    };

    /*
     * calculates a patient's score
     * */
    this.calculate =  function(edTriagePatient) {
        var score = 0;
        var totalItems = 17;
        var completedItems = 0;
        for (var prop in edTriagePatient) {
            if (edTriagPatient.hasOwnProperty(prop)) {
                // do stuff
                var v = edTriagePatient[prop];
                if (v instanceof Boolean) {
                    score += (v == true) ? 1 : 0;
                    if(v == true){
                        ++completedItems;
                    }
                }
                // else if (v instanceof CONSTANTS.MOBILITY_TYPES || v instanceof CONSTANTS.CONSCIOUSNESS_TYPES) {
                //     score += v.score;
                //     ++completedItems;
                // }
                else {
                    //this is a bad, we should report this
                    console.log("Invalid property: " + prop);
                }
            }

        }
        edTriagPatient.score = score;
        edTriagePatient.percentComplete = completedItems/totalItems*100;
        return score;
    };

    this.CONSTANTS = CONSTANTS;

    function createNewEdTriageRecord(id) {

        return{
        score : 0,
        percentComplete:0,
        patientId : id,
        patientType : CONSTANTS.PATIENT_TYPES.Adult,
        complaint : CONSTANTS.EMPTY_VALUES.STR,
        vitals : {
            mobility:Concepts.mobility.answers[2].uuid,
            respiratoryRate:CONSTANTS.EMPTY_VALUES.NUM,
            oxygenSaturation:CONSTANTS.EMPTY_VALUES.NUM,
            heartRate: CONSTANTS.EMPTY_VALUES.NUM,
            bloodPressure:{systolic: CONSTANTS.EMPTY_VALUES.NUM, diastolic: CONSTANTS.EMPTY_VALUES.NUM},
            temperature:CONSTANTS.EMPTY_VALUES.NUM,
            consciousness: CONSTANTS.EMPTY_VALUES.STR,
            trauma:false,
            weight: CONSTANTS.EMPTY_VALUES.NUM
        },
        symptoms : {
            neurological: CONSTANTS.NONE_CONCEPT_UUID,
            burn:CONSTANTS.NONE_CONCEPT_UUID,
            trauma:CONSTANTS.NONE_CONCEPT_UUID,
            digestive:CONSTANTS.NONE_CONCEPT_UUID,
            pregnancy:CONSTANTS.NONE_CONCEPT_UUID,
            respiratory:CONSTANTS.NONE_CONCEPT_UUID,
            pain:CONSTANTS.NONE_CONCEPT_UUID,
            other:CONSTANTS.NONE_CONCEPT_UUID
        }}

    }

}]);