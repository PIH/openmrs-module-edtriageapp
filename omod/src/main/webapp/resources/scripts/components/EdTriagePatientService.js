angular.module("edTriageService", [])
    .service('PatientService', ['$http', function($http) {
    var url = "/openmrs/ms/uiframework/resource/edtriageapp/scripts/app/mock_data/patient_id_";

    var CONSTANTS = {
        //defines an empty value, so that we can tell if the form has been filled out
        EMPTY_VALUES:{NUM:-1, STR:""},
        // defined the different kinds of patients that we can see, adult/child/infant
        // this information determines what the form will look like
        PATIENT_TYPES:{
            Adult:{id:'A', descriptionKey:'edtriage.adult.text'},
            Child:{id:'C', descriptionKey:'edtriage.child.text'},
            Infant:{id:'I', descriptionKey:'edtriage.infant.text'}
        },
        //the different kinds of mobility types that we will accept in the vitals section
        MOBILITY_TYPES:{
            Walking:{id:'walking', descriptionKey:'edtriage.walking.text', score:0},
            WithHelp:{id:'withHelp', descriptionKey:'edtriage.walking_with_help.text', score:1},
            Immobile:{id:'immobile', descriptionKey:'edtriage.immobile.text', score:2}
        },
        //this different types of consciousness that we will accept in the vitals section
        CONSCIOUSNESS_TYPES:{
            Confused : {id:'confused', descriptionKey:'edtriage.confused.text', score:2},
            Alert: {id:'alert', descriptionKey:'edtriage.alert.text', score:0},
            ReactsToVoice: {id:'reactsToVoice', descriptionKey:'edtriage.reactsToVoice.text', score:1},
            ReactsToPain: {id:'reactsToPain', descriptionKey:'edtriage.reactsToPain.text', score:2},
            Unresponsive: {id:'unresponsive', descriptionKey:'edtriage.unresponsive.text', score:3}
        }
    };

    this.getPatientTypeAsString = function(patientData){
        if(patientData !==  null){
        for(var t in CONSTANTS.PATIENT_TYPES){
            if(t.id == patientData.patientType){
                return t.descriptionKey;
            }
        }
        }
        return "unknown";
    };

    this.load = function(id) {
        return $http.get(url + id + '.json').then(function(resp) {
            if(resp.status == 200){
                return resp.data;
            }
            else{
                //TODO: how to handle these eerrors
                return null;
            }

        });
    };
    this.save = function(edTriagePatient) {
        //var scope = this;
        $http.post(url + edTriagePatient.patientId, edTriagePatient).success(function(data) {
            //TODO: return some code
        });
    };

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
                else if (v instanceof CONSTANTS.MOBILITY_TYPES || v instanceof CONSTANTS.CONSCIOUSNESS_TYPES) {
                    score += v.score;
                    ++completedItems;
                }
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

    function EdTriagePatient(id) {
        this.score = 0;
        this.percentComplete=0;
        this.patientId = id;
        this.patientType = CONSTANTS.PATIENT_TYPES.Adult;
        this.complaint = CONSTANTS.EMPTY_VALUES.STR;
        this.vitals = {
            mobility:CONSTANTS.MOBILITY_TYPES.Walking,
            respiratoryRate:CONSTANTS.EMPTY_VALUES.NUM,
            oxygenSaturation:CONSTANTS.EMPTY_VALUES.NUM,
            heartRate: CONSTANTS.EMPTY_VALUES.NUM,
            bloodPressure:{systolic: CONSTANTS.EMPTY_VALUES.NUM},
            temperature:CONSTANTS.EMPTY_VALUES.NUM,
            consciousness: CONSTANTS.CONSCIOUSNESS_TYPES.Alert,
            trauma:false,
            weight: CONSTANTS.EMPTY_VALUES.NUM
        };
        this.symptions = {
            neurological: {
                seizure: {convulsize: false, postConvulsive: false},
                focalNeurology: false,
                levelOfConsciousReduced: false,
                aggression: false,
                infantileHypotonia: false,
                none: false,
                unknown: false
            },
            burn:{
                facialInhalation:false,
                over20pct:false,
                over10pct:false,
                electricalOrChemical:false,
                other: false,
                none: false,
                unknown: false
            },
            trauma:{
                serious: false,
                threatenedLimb:false,
                dislocation:{largeJoint:false, appendage:false},
                fracture: {open:false, closed:false},
                hemorrhage:{controlled:false, uncontrolled:false},
                cannotSupportWeight: false,
                none: false,
                unknown: false
            },
            digestive:{
                vomiting:{freshBlood: false, persistent:false},
                refusesFoodDrink:false,
                none: false,
                unknown: false
            },
            pregnancy:{
                abdominalTrauma:false,
                vaginalTrauma:false,
                none: false,
                unknown: false
            },
            respiratory:{
                hypersalivation:false,
                stridor:false,
                oxygenGreaterThan85pct:false,
                shortnessOfBreath:{any:false, acute:false},
                coughingBlood:false,
                sibilance:false,
                none: false,
                unknown: false
            },
            pain:{
                severe:false,
                moderate:false,
                mild:false,
                chest:false,
                abdominal:false,
                other: false,
                none: false,
                unknown: false
            },
            other:{
                poisoningOrOverdose:false,
                pulpura:false,
                drowsiness:false,
                incoherent:false,
                anuria:false,
                diabetic:{
                    glucoseGreaterThan60:false,
                    hypoglycemiaLessThan54:false,
                    glucoseGreaterThan200:false,
                    glucoseGreaterThan300:false,
                    none: false,
                    unknown: false
                }
            }
        };

    }

}]);