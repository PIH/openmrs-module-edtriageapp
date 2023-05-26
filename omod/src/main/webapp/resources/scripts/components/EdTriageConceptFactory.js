angular.module("edTriageConceptFactory", [])
    .factory('EdTriageConcept', ['$filter', function ($filter) {

        /**
         * Constructor, with class name
         */
        function EdTriageConcept(config) {
            if (config?.toLowerCase() === 'sierraleone') {
                buildSierraLeoneTriageConcept(this);
            }
            else {
                buildDefaultEdTriageConcept(this);
            }
        }

        function buildDefaultEdTriageConcept(obj) {
            var GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID = "060f63dd-9588-4dc2-bf19-c90da02bff15";
            // Public properties, assigned to the instance ('obj')
            obj.triageQueueStatus =  toAnswers("triageQueueStatus", [
                    toAnswer(EdTriageConcept.status.waitingForEvaluation, "waitingForEvaluation"),
                    toAnswer(EdTriageConcept.status.outpatientConsultation, "outpatientConsultation"),
                    toAnswer(EdTriageConcept.status.leftWithoutBeingSeen, "leftWithoutBeingSeen"),
                    toAnswer(EdTriageConcept.status.removed, "remove"),
                    toAnswer(EdTriageConcept.status.expired, "expire")]
                , "66c18ba5-459e-4049-94ab-f80aca5c6a98");
            obj.triageColorCode =  toAnswers("triageColorCode", [
                    toAnswer(EdTriageConcept.score.red, "red"),
                    toAnswer(EdTriageConcept.score.green, "green"),
                    toAnswer(EdTriageConcept.score.yellow, "yellow"),
                    toAnswer(EdTriageConcept.score.orange, "orange")]
                , "f81631c8-f658-4472-a7eb-c618b05e6149");
            obj.triageScore = toAnswer("f6ee497c-1db0-4c58-a55c-d65175a91fb9", "score");
            obj.triageWaitingTime = toAnswer("d9a8fc6f-8695-46b8-854f-2c9e818b4568", "triageWaitingTime");
            obj.chiefComplaint = toAnswer("160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "chiefComplaint");
            obj.clinicalImpression = toAnswer("3cd9d956-26fe-102b-80cb-0017a47871b2", "clinicalImpression");
            obj.labs = {
                glucose: toAnswer("3cd4e194-26fe-102b-80cb-0017a47871b2", "glucose", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }

                    if(ageType == EdTriageConcept.ageType.INFANT){
                        if ( value < 54 ) return { numericScore: 0, colorCode: EdTriageConcept.score.red };
                        return {numericScore: 0, colorCode: EdTriageConcept.score.green};
                    } else {
                        if ( value < 60 ) { return {numericScore: 0, colorCode: EdTriageConcept.score.red} };
                        if ( (value > 300) && ( value <= 450) ) {
                            return { numericScore: 0, colorCode: EdTriageConcept.score.yellow };
                        }
                        if ( value > 450 ) {
                            return { numericScore: 0, colorCode: EdTriageConcept.score.orange };
                        }
                        return {numericScore: 0, colorCode: EdTriageConcept.score.green};
                    }
                }),
                lowGlucoseLevel: toAnswers('lowGlucoseLevel',
                    [toAnswer("3cd6f600-26fe-102b-80cb-0017a47871b2", "lowGlucoseLevel", function(ageType, value) {
                        if (value.length > 0) {
                            return {numericScore: 0, colorCode: EdTriageConcept.score.red};
                        } else {
                            return {numericScore: 0, colorCode: EdTriageConcept.score.green};
                        }
                    })],
                    "ff55a386-e25d-461d-994f-f43e219b94f1"),
                highGlucoseLevel: toAnswers('highGlucoseLevel',
                    [ toAnswer("3cd6f600-26fe-102b-80cb-0017a47871b2","highGlucoseLevel", function(ageType, value) {
                        if (value.length > 0) {
                            if(ageType == EdTriageConcept.ageType.CHILD || ageType == EdTriageConcept.ageType.ADULT){
                                return {numericScore: 0, colorCode: EdTriageConcept.score.orange};
                            }
                        }
                        return {numericScore: 0, colorCode: EdTriageConcept.score.green};
                    }) ],
                    "05819e23-100e-41da-ae7b-cfc401ca7146"),
                pregnancy_test: toAnswers('pregnancy_test',
                    [toAnswer("3cd3a7a2-26fe-102b-80cb-0017a47871b2","positive", {numericScore: 0}, 'A'),
                        toAnswer("3cd28732-26fe-102b-80cb-0017a47871b2","negative", {numericScore: 0}, 'A')],
                    "3ce44134-26fe-102b-80cb-0017a47871b2")
            };

            obj.treatment = {
                oxygen: toAnswers('oxygen',
                    [ toAnswer("90660681-4b00-469c-b65b-c91afd241c86","oxygen") ],
                    "5f9721f5-83d9-40f4-bb30-5299c0840667"),
                paracetamol: toAnswers('paracetamol',
                    [ toAnswer("3cccd4d6-26fe-102b-80cb-0017a47871b2","paracetamol") ],
                    "5f9721f5-83d9-40f4-bb30-5299c0840667"),
                paracetamolDose: toAnswer("5e7907c6-6a1e-4dcd-a3df-572b3a07e027", "paracetamolDose")
            }

            obj.vitals = {
                mobility: toAnswers('mobility',
                    [toAnswer("38b69221-d8c5-41ca-81fb-258469bdf519", "immobile", { numericScore: 2, colorCode: EdTriageConcept.score.green}, null, 4),
                        toAnswer("d335ec09-c724-4327-9726-f3c984bb1ca1", "with help", { numericScore: 1, colorCode: EdTriageConcept.score.green }, 'AC', 2),
                        toAnswer("3cd65f7e-26fe-102b-80cb-0017a47871b2", "walking", { numericScore: 0, colorCode: EdTriageConcept.score.green } , 'AC', 1),
                        toAnswer("3cd750a0-26fe-102b-80cb-0017a47871b2", "normal for age", { numericScore: 0, colorCode: EdTriageConcept.score.green } , EdTriageConcept.ageType.INFANT, 3)]
                    , "611e7b0a-5b34-47ac-b352-02c2dc653255"),
                respiratoryRate: toAnswer("3ceb11f8-26fe-102b-80cb-0017a47871b2", "respiratoryRate", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.ADULT){
                        if(value < 9) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 15) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 21) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        if(value < 30) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.CHILD){
                        if(value < 15) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 17) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 22) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 27) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.INFANT){
                        if(value < 20) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 26) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 40) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 50) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                    }
                }),
                oxygenSaturation: toAnswer("3ce9401c-26fe-102b-80cb-0017a47871b2", "oxygenSaturation", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if (ageType == EdTriageConcept.ageType.ADULT) {
                        if(value < 85) { return { numericScore: 0, colorCode: EdTriageConcept.score.red }; }
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    else {
                        if(value < 92) { return { numericScore: 0, colorCode: EdTriageConcept.score.red }; }
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                }),
                heartRate: toAnswer("3ce93824-26fe-102b-80cb-0017a47871b2", "heartRate", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if ( value == 0 ) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.blue };
                    }
                    if(ageType == EdTriageConcept.ageType.ADULT){
                        if(value < 41) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 51) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        if(value < 101) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 111) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        if(value < 130) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 146) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 3, colorCode: EdTriageConcept.score.red };
                    }
                    if(ageType == EdTriageConcept.ageType.CHILD){
                        if(value < 60) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 80) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 100) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 130) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.INFANT){
                        if(value < 70) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 80) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 131) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 160) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                    }
                }),
                systolicBloodPressure: toAnswer("3ce934fa-26fe-102b-80cb-0017a47871b2", "systolicBloodPressure", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.ADULT){
                        if(value < 71) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 81) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 101) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        if(value < 200) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                    }
                    return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                }, EdTriageConcept.ageType.ADULT),
                diastolicBloodPressure: toAnswer("3ce93694-26fe-102b-80cb-0017a47871b2", "diastolicBloodPressure", function(ageType, value){
                    return  { numericScore: 0, colorCode: EdTriageConcept.score.green };
                }, EdTriageConcept.ageType.ADULT),
                temperature: toAnswer("3ce939d2-26fe-102b-80cb-0017a47871b2", "temperature", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if(value < 35) {
                        return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                    }
                    if(value <= 38.4) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                }),
                consciousness: toAnswers(        'consciousness',
                    [toAnswer("3cf27e66-26fe-102b-80cb-0017a47871b2", "confusion", { numericScore: 2, colorCode: EdTriageConcept.score.green }, 'AC', 1),
                        toAnswer("160282AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "alert",  { numericScore: 0, colorCode: EdTriageConcept.score.green }, null, 2),
                        toAnswer("162645AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "reacts to voice", { numericScore: 1, colorCode: EdTriageConcept.score.green }, null, 3),
                        toAnswer("162644AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "responds to pain", { numericScore: 2, colorCode: EdTriageConcept.score.green }, null, 4),
                        toAnswer("f7a1fd17-f12d-48c1-b3dd-8e9fc95c8100", "unresponsive",  { numericScore: 3, colorCode: EdTriageConcept.score.green }, null, 5)],
                    GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                trauma: toAnswers('trauma', [toAnswer("124193AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "trauma", function(ageType, value){
                        return value.length > 0 ?  { numericScore: 1, colorCode: EdTriageConcept.score.green } :  { numericScore: 0, colorCode: EdTriageConcept.score.green };})],
                    GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                weight: toAnswer("3ce93b62-26fe-102b-80cb-0017a47871b2", "weight", function(ageType, value){
                    return  { numericScore: 0, colorCode: EdTriageConcept.score.green };
                })
            } ;


            obj.symptoms = {
                emergencySigns: toAnswers('emergencySigns',[
                        toAnswer("164348AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "impaired airway",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 1),
                        toAnswer("3cedf31e-26fe-102b-80cb-0017a47871b2", "impaired breathing",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 2),
                        toAnswer("911c064e-5247-4017-a9fd-b30105c36052", "shock",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 3),]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                neurological: toAnswers('neurological',[
                        toAnswer("3cce938e-26fe-102b-80cb-0017a47871b2", "seizure - convulsive",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 1),
                        toAnswer("ad52aee5-c789-4442-8dfc-2242375f22e8", "seizure - post convulsive",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 2),
                        toAnswer("f4433b74-6396-47ff-aa63-3900493ebf23", "acute focal neurologic deficit",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 3),
                        toAnswer("eacf7a54-b2fb-4dc1-b2f8-ee0b5926c16c", "level of consciousness reduced",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 4),
                        toAnswer("3ccea7fc-26fe-102b-80cb-0017a47871b2", "psychosis",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'AC', 5),
                        toAnswer("2b436367-c44b-4835-90ad-e93e77d45a97", "infantile hypotonia",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.INFANT, 6),
                        toAnswer("143582AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "prolonged crying",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.INFANT, 7)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                burn: toAnswers('burn',[
                        toAnswer("120977AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "burn - face/head/neck",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 1),
                        toAnswer("163476AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "significant burn of skin was (burn over 20% or circumferential)",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 2),
                        toAnswer("c05b25f1-07d1-47de-a61e-fc9d3bfe95eb", "Burn - electrical or chemical", { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 3),
                        toAnswer("3ccd21e8-26fe-102b-80cb-0017a47871b2", "burn-other",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 4)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                diabetic: toAnswers('diabetic',[
                        toAnswer("07ece75a-2a53-44ff-be48-15a4f7abc28a", "Ketonuria",  { numericScore: 0, colorCode: EdTriageConcept.score.green }, 'AC')]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                trauma: toAnswers('trauma',[
                        toAnswer("3b7f125b-6254-4442-be14-f8f6543c8d63", "serious trauma",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 1),
                        toAnswer("cef19dbc-e015-4123-9479-986f26a7ca8c", "threatened limb",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 2),
                        toAnswer("aca0abff-a38a-4191-a5c4-041fa1809306", "dislocation of larger joint (not finger or toe)",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 3),
                        toAnswer("132338AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "open fracture",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 4),
                        toAnswer("628ccc25-d0b3-4e73-b01e-1fdd840256bd", "haemorrhage - uncontrolled",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 5),
                        toAnswer("6720b77d-b563-44dc-aa17-c9dcb37db8e8", "Cannot support any weight",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.INFANT, 6),
                        toAnswer("a218b3d9-2ead-4fa2-afbd-64849012e125", "dislocation of finger or toe",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 7),
                        toAnswer("139899AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "fracture - closed",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 8),
                        toAnswer("6807f3b3-4176-49d7-80ff-41603d5c612b", "haemorrhage - controlled",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 9)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                digestive: toAnswers('digestive',[
                        toAnswer("139006AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "vomiting - fresh blood",  { numericScore: 0, colorCode: EdTriageConcept.score.orange}, EdTriageConcept.ageType.ADULT, 1),
                        toAnswer("130334AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "vomiting - persistent",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.ADULT, 2),
                        toAnswer("139582AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "Gastrointestinal hemorrhage",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 3),
                        toAnswer("2d70f8ca-f3dd-4988-8107-9f6b2beb5ff1", "refuses to feed/drink",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.INFANT, 6),
                        toAnswer("3cf1c930-26fe-102b-80cb-0017a47871b2", "Vomiting", { numericScore: 0, colorCode: EdTriageConcept.score.yellow },'CI', 4),
                        toAnswer("4522ea3d-6045-43d8-a97c-33117191da87", "Persistent diarrhea", { numericScore: 0, colorCode: EdTriageConcept.score.yellow },'CI', 5)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                pregnancy: toAnswers('pregnancy',[
                        toAnswer("153551AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "pregnancy & abdominal trauma or pain",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 1),
                        toAnswer("117617AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "pregnancy & trauma or vaginal bleeding",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 2 )]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                respiratory: toAnswers('respiratory',[
                        toAnswer("f7ef0b85-6af3-43b9-87a5-5abf89e3a3f5", "hypersalivation",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'CI', 1),
                        toAnswer("24fa118d-f81d-439d-82a5-d7c6ac6ef72b", "stridor",  function(ageType, value) {
                            if (ageType == EdTriageConcept.ageType.INFANT) {
                                return { numericScore: 0, colorCode: EdTriageConcept.score.red };
                            } else if (ageType == EdTriageConcept.ageType.CHILD) {
                                return { numericScore: 0, colorCode: EdTriageConcept.score.orange };
                            }
                        }, 'I', 2),
                        toAnswer("3cf1a95a-26fe-102b-80cb-0017a47871b2", "dyspnea-shortness of breath",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'I', 3),
                        toAnswer("3cf1a95a-26fe-102b-80cb-0017a47871b2", "dyspnea-shortness of breath",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'C', 4),
                        toAnswer("24fa118d-f81d-439d-82a5-d7c6ac6ef72b", "stridor",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'C', 5),
                        toAnswer("3ceade68-26fe-102b-80cb-0017a47871b2", "sibilance",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 6),
                        toAnswer("12d9f052-6980-4542-91ef-190247811228", "shortness of breath - acute",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 7),
                        toAnswer("4c1c143e-c1b3-4225-8053-93ab22f7bbb3", "coughing blood ",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 8)
                    ]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                pain: toAnswers('pain',[
                        toAnswer("d092c376-5f89-4abd-a6ec-8632587b797b", "severe pain",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 1),
                        toAnswer("10008d98-6653-47fb-b171-02e0f257e875", "moderate pain",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 3),
                        toAnswer("3ccd2364-26fe-102b-80cb-0017a47871b2", "chest pain",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 2),
                        toAnswer("3ccdf8d4-26fe-102b-80cb-0017a47871b2", "abdominal pain",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 4)
                    ]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                other: toAnswers('other',[
                        toAnswer("3ccccc20-26fe-102b-80cb-0017a47871b2", "toxicity-Poisoning/overdose",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 1),
                        toAnswer("15bd52f1-a35b-489d-a283-ece958c4ef1e", "purpura",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 2),
                        toAnswer("8084b7b2-adc4-4b83-aafc-647d1308c988", "drowsiness",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.CHILD, 3),
                        toAnswer("137646AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "incoherent story (or history)",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, 'CI', 4),
                        toAnswer("148566AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "anuria",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.INFANT, 5)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID)

            }
        }

        /**
         * The triage questions and answered, customized for Sierra Leone
         * Note that Sierra Leone also have custom display strings for many fields, which are defined in edtriage_en.json the Sierra Leone config
         * @param obj
         */
        function buildSierraLeoneTriageConcept(obj) {
            // **note that SL also overrides some messages properties, see edtriage_en.properties in config-pihsl**
            var GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID = "060f63dd-9588-4dc2-bf19-c90da02bff15";
            // Public properties, assigned to the instance ('obj')
            obj.triageQueueStatus =  toAnswers("triageQueueStatus", [
                    toAnswer(EdTriageConcept.status.waitingForEvaluation, "waitingForEvaluation"),
                    toAnswer(EdTriageConcept.status.outpatientConsultation, "outpatientConsultation"),
                    toAnswer(EdTriageConcept.status.leftWithoutBeingSeen, "leftWithoutBeingSeen"),
                    toAnswer(EdTriageConcept.status.removed, "remove"),
                    toAnswer(EdTriageConcept.status.expired, "expire")]
                , "66c18ba5-459e-4049-94ab-f80aca5c6a98");
            obj.triageColorCode =  toAnswers("triageColorCode", [
                    toAnswer(EdTriageConcept.score.red, "red"),
                    toAnswer(EdTriageConcept.score.green, "green"),
                    toAnswer(EdTriageConcept.score.yellow, "yellow"),
                    toAnswer(EdTriageConcept.score.orange, "orange")]
                , "f81631c8-f658-4472-a7eb-c618b05e6149");
            obj.triageScore = toAnswer("f6ee497c-1db0-4c58-a55c-d65175a91fb9", "score");
            obj.triageWaitingTime = toAnswer("d9a8fc6f-8695-46b8-854f-2c9e818b4568", "triageWaitingTime");
            obj.chiefComplaint = toAnswer("160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "chiefComplaint");
            obj.clinicalImpression = toAnswer("3cd9d956-26fe-102b-80cb-0017a47871b2", "clinicalImpression");
            obj.labs = {
                glucose: toAnswer("3cd4e194-26fe-102b-80cb-0017a47871b2", "glucose", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }

                    if (ageType == EdTriageConcept.ageType.CHILD || ageType == EdTriageConcept.ageType.INFANT){
                        if ( value < 55 ) return { numericScore: 0, colorCode: EdTriageConcept.score.red };
                        if ( ( value > 54 ) && (value < 65)) return { numericScore: 0, colorCode: EdTriageConcept.score.orange };
                        if ( value > 399 ) return { numericScore: 0, colorCode: EdTriageConcept.score.red };
                        if ( ( value > 199 ) && (value < 300) ) return { numericScore: 0, colorCode: EdTriageConcept.score.yellow };
                        if ( ( value > 299 ) && (value < 400)) return { numericScore: 0, colorCode: EdTriageConcept.score.orange };
                        return {numericScore: 0, colorCode: EdTriageConcept.score.green};
                    } else {
                        if ( value < 60 ) { return {numericScore: 0, colorCode: EdTriageConcept.score.red} };
                        if ( (value > 300) && ( value <= 450) ) {
                            return { numericScore: 0, colorCode: EdTriageConcept.score.yellow };
                        }
                        if ( value > 450 ) {
                            return { numericScore: 0, colorCode: EdTriageConcept.score.orange };
                        }
                        return {numericScore: 0, colorCode: EdTriageConcept.score.green};
                    }
                }),
                lowGlucoseLevel: toAnswers('lowGlucoseLevel',
                    [toAnswer("3cd6f600-26fe-102b-80cb-0017a47871b2", "lowGlucoseLevel", function(ageType, value) {
                        if (value.length > 0) {
                            return {numericScore: 0, colorCode: EdTriageConcept.score.red};
                        } else {
                            return {numericScore: 0, colorCode: EdTriageConcept.score.green};
                        }
                    })],
                    "ff55a386-e25d-461d-994f-f43e219b94f1"),
                highGlucoseLevel: toAnswers('highGlucoseLevel',
                    [ toAnswer("3cd6f600-26fe-102b-80cb-0017a47871b2","highGlucoseLevel", function(ageType, value) {
                        if (value.length > 0) {
                            if(ageType == EdTriageConcept.ageType.CHILD || ageType == EdTriageConcept.ageType.ADULT){
                                return {numericScore: 0, colorCode: EdTriageConcept.score.orange};
                            }
                        }
                        return {numericScore: 0, colorCode: EdTriageConcept.score.green};
                    }) ],
                    "05819e23-100e-41da-ae7b-cfc401ca7146")
            };

            obj.treatment = null;

            obj.vitals = {
                mobility: toAnswers('mobility',
                    [toAnswer("38b69221-d8c5-41ca-81fb-258469bdf519", "immobile", { numericScore: 2, colorCode: EdTriageConcept.score.green}, null, 4),
                        toAnswer("d335ec09-c724-4327-9726-f3c984bb1ca1", "with help", { numericScore: 1, colorCode: EdTriageConcept.score.green }, 'AC', 2),
                        toAnswer("3cd65f7e-26fe-102b-80cb-0017a47871b2", "walking", { numericScore: 0, colorCode: EdTriageConcept.score.green } , 'AC', 1),
                        toAnswer("3cd750a0-26fe-102b-80cb-0017a47871b2", "normal for age", { numericScore: 0, colorCode: EdTriageConcept.score.green } , EdTriageConcept.ageType.INFANT, 3)]
                    , "611e7b0a-5b34-47ac-b352-02c2dc653255"),
                respiratoryRate: toAnswer("3ceb11f8-26fe-102b-80cb-0017a47871b2", "respiratoryRate", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.ADULT){
                        if(value < 9) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 15) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 21) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        if(value < 30) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.CHILD){
                        if(value < 15) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 17) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 22) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 27) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.INFANT){
                        if(value < 20) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 26) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 40) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 50) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                    }
                }),
                oxygenSaturation: toAnswer("3ce9401c-26fe-102b-80cb-0017a47871b2", "oxygenSaturation", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if (ageType == EdTriageConcept.ageType.ADULT) {
                        if(value < 85) return { numericScore: 0, colorCode: EdTriageConcept.score.red };
                        if(value < 90) return { numericScore: 0, colorCode: EdTriageConcept.score.orange };
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    else {
                        if(value < 92) { return { numericScore: 0, colorCode: EdTriageConcept.score.red }; }
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                }),
                heartRate: toAnswer("3ce93824-26fe-102b-80cb-0017a47871b2", "heartRate", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if ( value == 0 ) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.blue };
                    }
                    if(ageType == EdTriageConcept.ageType.ADULT){
                        if(value < 41) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 51) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        if(value < 101) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 111) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        if(value < 130) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 146) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 3, colorCode: EdTriageConcept.score.red };
                    }
                    if(ageType == EdTriageConcept.ageType.CHILD){
                        if(value < 60) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 80) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 100) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 130) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.INFANT){
                        if(value < 70) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 80) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 131) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 160) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                    }
                }),
                systolicBloodPressure: toAnswer("3ce934fa-26fe-102b-80cb-0017a47871b2", "systolicBloodPressure", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.ADULT){
                        if(value < 71) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 81) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 101) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        if(value < 200) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                    }
                    return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                }, EdTriageConcept.ageType.ADULT),
                diastolicBloodPressure: toAnswer("3ce93694-26fe-102b-80cb-0017a47871b2", "diastolicBloodPressure", function(ageType, value){
                    return  { numericScore: 0, colorCode: EdTriageConcept.score.green };
                }, EdTriageConcept.ageType.ADULT),
                temperature: toAnswer("3ce939d2-26fe-102b-80cb-0017a47871b2", "temperature", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if(value < 35) {
                        return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                    }
                    if(value <= 38.4) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                }),
                consciousness: toAnswers(        'consciousness',
                    [toAnswer("3cf27e66-26fe-102b-80cb-0017a47871b2", "confusion", { numericScore: 2, colorCode: EdTriageConcept.score.green }, 'AC', 2),
                        toAnswer("160282AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "alert",  { numericScore: 0, colorCode: EdTriageConcept.score.green }, null, 1),
                        toAnswer("162645AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "reacts to voice", { numericScore: 1, colorCode: EdTriageConcept.score.green }, null, 3),
                        toAnswer("162644AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "responds to pain", { numericScore: 2, colorCode: EdTriageConcept.score.green }, null, 4),
                        toAnswer("f7a1fd17-f12d-48c1-b3dd-8e9fc95c8100", "unresponsive",  { numericScore: 3, colorCode: EdTriageConcept.score.green }, null, 5)],
                    GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                trauma: toAnswers('trauma', [toAnswer("124193AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "trauma", function(ageType, value){
                        return value.length > 0 ?  { numericScore: 1, colorCode: EdTriageConcept.score.green } :  { numericScore: 0, colorCode: EdTriageConcept.score.green };})],
                    GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                weight: toAnswer("3ce93b62-26fe-102b-80cb-0017a47871b2", "weight", function(ageType, value){
                    return  { numericScore: 0, colorCode: EdTriageConcept.score.green };
                })
            } ;


            obj.symptoms = {
                emergencySigns: toAnswers('emergencySigns',[
                        toAnswer("164348AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "impaired airway",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 1),
                        toAnswer("3cedf31e-26fe-102b-80cb-0017a47871b2", "impaired breathing",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 2),
                        toAnswer("911c064e-5247-4017-a9fd-b30105c36052", "shock",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 3),]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                dehydration: toAnswers('dehydration', [
                        toAnswer("116334AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", 'lethargy', { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'CI', 1),
                        toAnswer("164457AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", 'sunken eyes', { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'CI', 2),
                        toAnswer("2225348c-2617-49fc-826c-50067511ba6c", 'V slow skin pinch', { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'CI', 3)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                neurological: toAnswers('neurological',[
                        toAnswer("3cce938e-26fe-102b-80cb-0017a47871b2", "seizure - convulsive",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 1),
                        toAnswer("ad52aee5-c789-4442-8dfc-2242375f22e8", "seizure - post convulsive",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 2),
                        toAnswer("f4433b74-6396-47ff-aa63-3900493ebf23", "acute focal neurologic deficit",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 3),
                        toAnswer("eacf7a54-b2fb-4dc1-b2f8-ee0b5926c16c", "level of consciousness reduced",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 4),
                        toAnswer("8084b7b2-adc4-4b83-aafc-647d1308c988", "drowsiness",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 5),
                        toAnswer("121748AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "aggression",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.CHILD, 6),
                        toAnswer("2b436367-c44b-4835-90ad-e93e77d45a97", "infantile hypotonia",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.INFANT, 7),
                        toAnswer("152330AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "restless and irritable",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, 'CI', 8)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                burn: toAnswers('burn',[
                        toAnswer("120977AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "burn - face/head/neck",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 1),
                        toAnswer("163476AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "significant burn of skin was (burn over 20% or circumferential)",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 2),
                        toAnswer("c05b25f1-07d1-47de-a61e-fc9d3bfe95eb", "Burn - electrical or chemical", { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 3),
                        toAnswer("124ed60a-4f5b-4587-8154-df3aeea652de", "Genital or perineal burn", { numericScore: 0, colorCode: EdTriageConcept.score.orange },'CI', 4),
                        toAnswer("3ccd21e8-26fe-102b-80cb-0017a47871b2", "burn-other",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 5)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                diabetic: toAnswers('diabetic',[
                        toAnswer("07ece75a-2a53-44ff-be48-15a4f7abc28a", "Ketonuria",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'AC')]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                trauma: toAnswers('trauma',[
                        toAnswer("3b7f125b-6254-4442-be14-f8f6543c8d63", "serious trauma",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 1),
                        toAnswer("cef19dbc-e015-4123-9479-986f26a7ca8c", "threatened limb",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 2),
                        toAnswer("aca0abff-a38a-4191-a5c4-041fa1809306", "dislocation of larger joint (not finger or toe)",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 3),
                        toAnswer("a218b3d9-2ead-4fa2-afbd-64849012e125", "dislocation of finger or toe",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.ADULT, 4),
                        toAnswer("3cd14b24-26fe-102b-80cb-0017a47871b2", "dislocation",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 5),
                        toAnswer("132338AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "open fracture",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 6),
                        toAnswer("139899AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "fracture - closed",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 7),
                        toAnswer("628ccc25-d0b3-4e73-b01e-1fdd840256bd", "haemorrhage - uncontrolled",function(ageType, value) {
                            if (ageType == EdTriageConcept.ageType.ADULT) {
                                return { numericScore: 0, colorCode: EdTriageConcept.score.orange };
                            } else {
                                return { numericScore: 0, colorCode: EdTriageConcept.score.red };
                            }
                        }, null, 8),
                        toAnswer("6807f3b3-4176-49d7-80ff-41603d5c612b", "haemorrhage - controlled",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 9),
                        toAnswer("6720b77d-b563-44dc-aa17-c9dcb37db8e8", "Cannot support any weight",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, 'CI', 10),
                        toAnswer("121748AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "aggression",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 11),
                        toAnswer("3cccd076-26fe-102b-80cb-0017a47871b2", "vehicle accident",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 12),
                        toAnswer("c1d68188-9dd8-4453-9fc4-1e321afb7264", "knife or gun",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 13),
                        toAnswer("c9b21031-f76d-463e-823a-cefdb35ed259", "eye injury",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 14)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                digestive: toAnswers('digestive',[
                        toAnswer("330d227b-fada-4b8b-a05c-ba56b8e96e19", "severe dehydration",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'CI', 1),
                        toAnswer("139006AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "vomiting - fresh blood",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 2),
                        toAnswer("130334AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "vomiting - persistent",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.ADULT, 3),
                        toAnswer("139582AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "Gastrointestinal hemorrhage",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 4),
                        toAnswer("3cf1c930-26fe-102b-80cb-0017a47871b2", "Vomiting", { numericScore: 0, colorCode: EdTriageConcept.score.yellow },'CI', 5),
                        toAnswer("4522ea3d-6045-43d8-a97c-33117191da87", "Persistent diarrhea", { numericScore: 0, colorCode: EdTriageConcept.score.yellow },'CI', 6),
                        toAnswer("2d70f8ca-f3dd-4988-8107-9f6b2beb5ff1", "refuses to feed/drink",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, 'CI', 7)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                pregnancy: toAnswers('pregnancy',[
                        toAnswer("153551AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "pregnancy & abdominal trauma or pain",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 1),
                        toAnswer("117617AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "pregnancy & trauma or vaginal bleeding",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 2 )]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                respiratory: toAnswers('respiratory',[
                        toAnswer("f7ef0b85-6af3-43b9-87a5-5abf89e3a3f5", "hypersalivation",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'CI', 1),
                        toAnswer("24fa118d-f81d-439d-82a5-d7c6ac6ef72b", "stridor",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'CI',2),
                        toAnswer("3cd20974-26fe-102b-80cb-0017a47871b2", "cyanosis",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'CI', 3),
                        toAnswer("125061AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "severe respiratory distress",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'CI', 4),
                        toAnswer("3cf1a95a-26fe-102b-80cb-0017a47871b2", "dyspnea-shortness of breath",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 5),
                        toAnswer("3ceade68-26fe-102b-80cb-0017a47871b2", "sibilance",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 6),
                        toAnswer("12d9f052-6980-4542-91ef-190247811228", "shortness of breath - acute",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 7),
                        toAnswer("4c1c143e-c1b3-4225-8053-93ab22f7bbb3", "coughing blood ",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 8),
                        toAnswer("133467AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "swelling neck or throat",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, 'CI', 9) ]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                pain: toAnswers('pain',[
                        toAnswer("d092c376-5f89-4abd-a6ec-8632587b797b", "severe pain",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 1),
                        toAnswer("10008d98-6653-47fb-b171-02e0f257e875", "moderate pain",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 4),
                        toAnswer("3ccd2364-26fe-102b-80cb-0017a47871b2", "chest pain",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 3),
                        toAnswer("3ccdf8d4-26fe-102b-80cb-0017a47871b2", "abdominal pain",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 5),
                        toAnswer("143582AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "prolonged crying",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 2)
                    ]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                other: toAnswers('other',[
                        toAnswer("3ccccc20-26fe-102b-80cb-0017a47871b2", "toxicity-Poisoning/overdose",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 2),
                        toAnswer("15bd52f1-a35b-489d-a283-ece958c4ef1e", "purpura",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'CI', 1),
                        toAnswer("926475af-fa78-476e-8373-fdc339856c69", "severe pallor",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 4),
                        toAnswer("d05b712f-f7ca-49d1-8e28-fd9fdb1ba951", "urgent referral",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 5),
                        toAnswer("3cccb654-26fe-102b-80cb-0017a47871b2", "malnutrition",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, 'CI', 5),
                        toAnswer("118729AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "leg edema",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, 'CI', 5),
                        toAnswer("148566AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "not urinating (anuria)",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, 'CI', 5)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID)

            }
        }

        function toAnswers(messageKey, answers, uuid) {
            // var key = "edtriageapp.i18n." + messageKey;
            // var translation = $filter('translate')(key);
            // //TODO:  this is just until we figure out the translations, so things are sort of readable
            // if(key == translation){
            //     translation = key.split(".")[2] + "{??}";
            // }
            return {answers: answers, label:messageKey, value: null, uuid:uuid};
        }

        function toAnswer(uuid, label, score, scope, displayOrder) {
            var scoreFunction = score;
            if (typeof scoreFunction !== "function") {
                scoreFunction = function(){
                    return score
                };
            }

            return {uuid: uuid, label: label, score: scoreFunction, scope: scope == null ? EdTriageConcept.ageType.ALL : scope, value: null,
            labelTranslated:function(ageType){
                return $filter('translate')(this.label, this.uuid, ageType);
            }, displayOrder: displayOrder == null ? 1 : displayOrder};
        }

        function isNumber(obj) {
            return !isNaN(parseFloat(obj));
        }
        
        //some static vars for the scores for symptoms
        EdTriageConcept.score = {
            blue: "ea658b2b-9c97-438b-a2c9-5dfcc9a24b73",
            red: "762ecf40-3065-47aa-93c3-15372d98d393",
            orange: "95d75a4a-cb14-4f1f-b7d5-f53e694b403f",
            yellow: "70763694-61c5-447f-abc3-91f144bfcc0b",
            green: "1d549146-e477-4dcc-9716-11fe4d1cad68"
        };

        EdTriageConcept.status = {
            waitingForEvaluation: "4dd3244d-fcb9-424d-ad8a-afd773c69923",
            outpatientConsultation: "3cdc871e-26fe-102b-80cb-0017a47871b2",
            leftWithoutBeingSeen: "dd050085-ef34-4318-9423-c4ed666ac372",
            removed: "45d0c3d2-2188-4186-8a19-0063b92914ee",
            expired: "1fa8d25e-7471-4201-815f-79fac44d9a5f"
        };

        EdTriageConcept.heartRate = "3ce93824-26fe-102b-80cb-0017a47871b2";
        EdTriageConcept.respiratoryRate = "3ceb11f8-26fe-102b-80cb-0017a47871b2";
        EdTriageConcept.oxygenSaturation = "3ce9401c-26fe-102b-80cb-0017a47871b2";
        EdTriageConcept.numericScore = "f6ee497c-1db0-4c58-a55c-d65175a91fb9";

        EdTriageConcept.lowGlucoseLevel = {
            yes: "3cd6f600-26fe-102b-80cb-0017a47871b2"
        };

        EdTriageConcept.highGlucoseLevel = {
            yes: "3cd6f600-26fe-102b-80cb-0017a47871b2"
        };

        EdTriageConcept.ageType = {
            ADULT: 'A',
            CHILD: 'C',
            INFANT: 'I',
            ALL: 'ACI'
        };
        
        // UHM-2669, define the wait times(in minutes) that would trigger blinking in the waiting queue
        EdTriageConcept.waitTimesConfig = {
            blue:0,
            red: 1,
            orange: 10,
            yellow: 60,
            green: 240
        };

        /**
         * Static method, assigned to class
         * Instance ('this') is not available in static context
         */
        EdTriageConcept.build = function (config, data, existingConcept) {

            var ret =existingConcept;
            if(existingConcept == null){
                ret = new EdTriageConcept(config);
            }

            updateConceptLabels(ret, data, 0);

            return ret;
            
            /* 
            updates the concepts labels with the translated text from the web service
            * */
            function updateConceptLabels(obj, data, level) {
                for (var propertyName in obj) {
                    var p = obj[propertyName];
                    if (p != null && typeof p == "object") {
                        if (p.hasOwnProperty('uuid')) {
                            //this an answer to a question, so let's look for a UUID that matches in the data and set the label for this
                            updateAnswerLabel(p, data);
                            if(p.hasOwnProperty("answers")){
                                //this also has some answers, so load those too
                                for (var i = 0; i < p.answers.length; ++i) {
                                    updateAnswerLabel(p.answers[i], data)
                                }
                            }
                        }
                        else if (propertyName == 'answers') {
                            //this is an array of answers, iterate
                            for (var i = 0; i < p.length; ++i) {
                                updateAnswerLabel(p[i], data)
                            }
                        }
                        else {
                            //this is some other property, check it's properties
                            updateConceptLabels(p, data, level +1);
                        }
                    }
                    else{
                        //NOTHING TO DO
                    }

                }
            }
            /* 
             updates the answer labels with the translated text from the web service
             * */
            function updateAnswerLabel(obj, data) {
                for (var i = 0; i < data.length; ++i) {
                    var concept = data[i];
                    //first look in the object for the uuid
                    if (concept.uuid == obj.uuid) {
                        obj.label = concept.display;
                        return;
                    }
                    //then check if the object has answers we can check
                    if(concept.answers != null && concept.answers.length>0){
                        for(var j=0;j<concept.answers.length;++j){
                            var a = concept.answers[j];
                            if(a.uuid == obj.uuid){
                                obj.label = a.display;
                                return;

                            }
                        }
                    }

                    if(concept.setMembers != null && concept.setMembers.length>0){
                        for(var j=0;j<concept.setMembers.length;++j){
                            var a = concept.setMembers[j];
                            if(a.uuid == obj.uuid){
                                obj.label = a.display;
                                return;

                            }
                        }
                    }

                }
            }
        };

        EdTriageConcept.findAnswer = function(concept, uuid){
            for (var propertyName in concept) {
                var p = concept[propertyName];
                if (p != null && typeof p == "object") {
                    if (p.hasOwnProperty('uuid')) {
                        if (p.uuid == uuid) {
                            //we found something, return the answer
                            return p;
                        }
                    }
                    else if (propertyName == 'answers') {
                        //this is an array of answers, iterate
                        for (var i = 0; i < p.length; ++i) {
                            var t = EdTriageConcept.findAnswer(p[i], data);
                            if(t != null){
                                return t;
                            }
                        }
                    }
                    else {
                        //this is some other property, check it's properties
                        var t  = EdTriageConcept.findAnswer(p, data, level +1);
                        if(t != null){
                            return t;
                        }
                    }
                }
                else{
                    //NOTHING TO DO just skip this property
                }

            }
        } ;


        /**
         * Return the constructor function
         */
        return EdTriageConcept;
    }]);
