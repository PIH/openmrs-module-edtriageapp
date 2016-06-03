//  generic answers
var yes_concept_uuid = "3cd6f600-26fe-102b-80cb-0017a47871b2";
var no_concept_uuid =  "3cd6f86c-26fe-102b-80cb-0017a47871b2";
var none_concept_uuid =  "3cd743f8-26fe-102b-80cb-0017a47871b2";
var unknown_concept_uuid =  "3cd6fac4-26fe-102b-80cb-0017a47871b2";

angular.module('constants', [])
    .value('DatetimeFormats', {
        date: "d-MMM-yy",
        time: "hh:mm a",
        datetime: "d-MMM-yy (hh:mm a)"
    })
    .value('EncounterTypes', {
        triage: {
            uuid: "74cef0a6-2801-11e6-b67b-9e71128cae77"
        }
    })
    .value('Concepts', {
        triageQueueStatus:{
            uuid: "11111111-1111-1111-1111-111111111111"
        } ,
        admissionLocation: {
            uuid: "f3e04276-2db0-4181-b937-d73275dc1b15"
        },
        chiefComplaint: {
            uuid: "160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        },
        // vitals section
        mobility: {
            uuid: "11111111-1111-1111-1111-111111111111",
            answers:[
                { uuid:"immobile_uuid_goes_here"},
                { uuid:"walking_with_help_uuid_goes_here"},
                { uuid:"walking_uuid_goes_here"}
            ]
        },
        respiratoryRate: {
            uuid: "3ceb11f8-26fe-102b-80cb-0017a47871b2"
        },
        oxygenSaturation: {
            uuid: "3ce9401c-26fe-102b-80cb-0017a47871b2"
        },
        heartRate: {
            uuid: "3ce93824-26fe-102b-80cb-0017a47871b2"
        },
        systolicBloodPressure: {
            uuid: "3ce934fa-26fe-102b-80cb-0017a47871b2"
        },
        diastolicBloodPressure: {
            uuid: "3ce93694-26fe-102b-80cb-0017a47871b2"
        },
        temperature: {
            uuid: "3ce939d2-26fe-102b-80cb-0017a47871b2"
        },
        consciousness: {
            uuid: "11111111-1111-1111-1111-111111111111",
            answers:[
                { uuid:"confused_uuid_goes_here"},
                { uuid:"alert_with_help_uuid_goes_here"},
                { uuid:"reacts_to_voice_uuid_goes_here"},
                { uuid:"reacts_to_pain_uuid_goes_here"},
                { uuid:"unresponsive_uuid_goes_here"}
            ]
        },
        trauma: {
            uuid: "11111111-1111-1111-1111-111111111111"
        },
        weight: {
            uuid: "3ce93b62-26fe-102b-80cb-0017a47871b2"
        },
        // symptoms section
        neurological: {
            uuid: "11111111-1111-1111-1111-111111111111",
            answers:[
                { uuid:"3cce938e-26fe-102b-80cb-0017a47871b2", score: "Red"},
                { uuid:"seizure_post_convulsive_uuid_goes_here", score: "Orange"},
                { uuid:"focal_neurology_acute_stroke__uuid_goes_here", score: "Orange"},
                { uuid:"level_of_consciousness_reduced_uuid_goes_here", score: "Orange"},
                { uuid:"psychosis_aggression_uuid_goes_here", score: "Orange"},
                { uuid:"Infantile hypotonia_uuid_goes_here", score: "Orange"},
                { uuid:none_concept_uuid, score: "Green"},
                { uuid:unknown_concept_uuid, score: "Green"}
            ]
        },
        burn: {
            uuid: "11111111-1111-1111-1111-111111111111",
            answers:[
                { uuid:"Burn - facial/inhalation uuid_goes_here", score: "Red"},
                { uuid:"Burn over 20% or circumferential uuid_goes_here ", score: "Orange"},
                { uuid:"Burn over 10% or circumferential uuid_goes_here", score: "Orange"},
                { uuid:"Burn - electrical or chemical uuid_goes_here", score: "Orange"},
                { uuid:"Burn - other uuid_goes_here", score: "Yellow"},
                { uuid:none_concept_uuid, score: "Green"},
                { uuid:unknown_concept_uuid, score: "Green"}
            ]

        },
        traumaDetails: {
            uuid: "11111111-1111-1111-1111-111111111111"  ,
            answers:[
                { uuid:"Serious trauma uuid_goes_here", score: "Orange"},
                { uuid:"Threatened limb uuid_goes_here ", score: "Orange"},
                { uuid:"Dislocation of larger joint (not finger or toe) uuid_goes_here", score: "Orange"},
                { uuid:"Fracture - open uuid_goes_here", score: "Orange"},
                { uuid:"Haemorrhage - uncontrolled uuid_goes_here", score: "Orange"},
                { uuid:"Cannot support any weight uuid_goes_here", score: "Yellow"},
                { uuid:"Dislocation of finger or toe uuid_goes_here", score: "Yellow"},
                { uuid:"Fracture - closed uuid_goes_here", score: "Yellow"},
                { uuid:"Haemorrhage - controlled uuid_goes_here", score: "Yellow"},
                { uuid:none_concept_uuid, score: "Green"},
                { uuid:unknown_concept_uuid, score: "Green"}
            ]
        },
        digestive: {
            uuid: "11111111-1111-1111-1111-111111111111" ,
            answers:[
                { uuid:"Vomiting - fresh blood uuid_goes_here", score: "Orange"},
                { uuid:"Vomiting - persistent uuid_goes_here ", score: "Yellow"},
                { uuid:"Refuses to feed/drink uuid_goes_here", score: "Yellow"},
                { uuid:none_concept_uuid, score: "Green"},
                { uuid:unknown_concept_uuid, score: "Green"}
            ]
        },
        pregnancy: {
            uuid: "11111111-1111-1111-1111-111111111111",
            answers:[
                { uuid:"Pregnancy & abdominal trauma or pain uuid_goes_here", score: "Orange"},
                { uuid:"Pregnancy & trauma or vaginal bleeding uuid_goes_here ", score: "Yellow"},
                { uuid:none_concept_uuid, score: "Green"},
                { uuid:unknown_concept_uuid, score: "Green"}
            ]
        },
        respiratory: {
            uuid: "11111111-1111-1111-1111-111111111111",
            answers: [{ uuid:"Hypersalivation uuid_goes_here", score: "Orange"},
                { uuid:"Stridor uuid_goes_here ", score: "Yellow"},
                { uuid:"Oxygen < 85% uuid_goes_here uuid_goes_here", score: "Yellow"},
                { uuid:"Shortness of breath - acute uuid_goes_here", score: "Yellow"},
                { uuid:"Shortness of breath uuid_goes_here", score: "Yellow"},
                { uuid:"Coughing blood uuid_goes_here", score: "Yellow"},
                { uuid:"Sibilance uuid_goes_here", score: "Yellow"},
                { uuid:none_concept_uuid, score: "Green"},
                { uuid:unknown_concept_uuid, score: "Green"}
            ]
        },
        pain: {
            uuid: "11111111-1111-1111-1111-111111111111"  ,
            answers: [{ uuid:"Hypersalivation uuid_goes_here", score: "Orange"},
                { uuid:"Severe pain uuid_goes_here ", score: "Yellow"},
                { uuid:"Moderate pain uuid_goes_here ", score: "Orange"},
                { uuid:"Mild pain uuid_goes_here ", score: "Yellow"},
                { uuid:"Chest pain uuid_goes_here ", score: "Orange"},
                { uuid:"Abdominal pain uuid_goes_here ", score: "Orange"},
                { uuid:"Other pain uuid_goes_here ", score: "Yellow"},
                { uuid:none_concept_uuid, score: "Green"},
                { uuid:unknown_concept_uuid, score: "Green"}
            ]
        },
        other: {
            uuid: "3cee7fb4-26fe-102b-80cb-0017a47871b2" ,
            answers: [{ uuid:"Hypersalivation uuid_goes_here", score: "Orange"},
                { uuid:"Poisoning/overdose uuid_goes_here ", score: "Yellow"},
                { uuid:"Purpura uuid_goes_here ", score: "Yellow"},
                { uuid:"Drowsiness uuid_goes_here ", score: "Yellow"},
                { uuid:"Incoherent story (or history) uuid_goes_here ", score: "Yellow"},
                { uuid:"Anuria uuid_goes_here ", score: "Yellow"},
                { uuid:"Diabetic: Glucose < 60 uuid_goes_here ", score: "Yellow"},
                { uuid:"Diabetic: Hypoglycemia < 54 uuid_goes_here ", score: "Yellow"},
                { uuid:"Diabetic: Glucose > 200 & ketonuria uuid_goes_here ", score: "Yellow"},
                { uuid:"Diabetic: Glucose > 300 & (no ketonuria) uuid_goes_here ", score: "Yellow"},
                { uuid:none_concept_uuid, score: "Green"},
                { uuid:unknown_concept_uuid, score: "Green"}
            ]
        }
    });
