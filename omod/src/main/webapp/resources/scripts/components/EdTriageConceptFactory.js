angular.module("edTriageConceptFactory", [])
    .factory('EdTriageConcept', ['$filter', function ($filter) {
        /**
         * Constructor, with class name
         */
        function EdTriageConcept() {
            var GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID = "060f63dd-9588-4dc2-bf19-c90da02bff15";
            // Public properties, assigned to the instance ('this')
            this.triageQueueStatus =  toAnswers("triageQueueStatus", [
                    toAnswer(EdTriageConcept.status.waitingForEvaluation, "waitingForEvaluation"),
                    toAnswer(EdTriageConcept.status.outpatientConsultation, "outpatientConsultation"),
                    toAnswer(EdTriageConcept.status.removed, "remove"),
                    toAnswer(EdTriageConcept.status.expired, "expire")]
                , "66c18ba5-459e-4049-94ab-f80aca5c6a98");
            this.triageColorCode =  toAnswers("triageColorCode", [
                    toAnswer(EdTriageConcept.score.red, "red"),
                    toAnswer(EdTriageConcept.score.green, "green"),
                    toAnswer(EdTriageConcept.score.yellow, "yellow"),
                    toAnswer(EdTriageConcept.score.orange, "orange")]
                , "f81631c8-f658-4472-a7eb-c618b05e6149");
            this.triageScore = toAnswer("f6ee497c-1db0-4c58-a55c-d65175a91fb9", "score");
            this.chiefComplaint = toAnswer("160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "chiefComplaint");
            this.clinicalImpression = toAnswer("3cd9d956-26fe-102b-80cb-0017a47871b2", "clinicalImpression");
            this.labs = {
                glucose: toAnswer("3cd4e194-26fe-102b-80cb-0017a47871b2", "Glucose"),
                pregnancy: toAnswers('pregnancy',
                    [toAnswer("3cd3a7a2-26fe-102b-80cb-0017a47871b2","positive", {numericScore: 0}, 'A'),
                     toAnswer("3cd28732-26fe-102b-80cb-0017a47871b2","negative", {numericScore: 0}, 'A')],
                    "3ce44134-26fe-102b-80cb-0017a47871b2")
            };
            this.treatment = toAnswer("treatment",
                    [   toAnswer("90660681-4b00-469c-b65b-c91afd241c86","oxygen"),
                        toAnswer("3cccd4d6-26fe-102b-80cb-0017a47871b2","paracetamol", {numericScore: 0}, 'A')],
                    "5f9721f5-83d9-40f4-bb30-5299c0840667");
            this.paracetamolDose = toAnswer("5e7907c6-6a1e-4dcd-a3df-572b3a07e027","paracetamol dose");
            this.vitals = {
                mobility: toAnswers('mobility',
                    [toAnswer("38b69221-d8c5-41ca-81fb-258469bdf519", "immobile", { numericScore: 2, colorCode: EdTriageConcept.score.green }),
                        toAnswer("d335ec09-c724-4327-9726-f3c984bb1ca1", "with help", { numericScore: 1, colorCode: EdTriageConcept.score.green }, 'AC'),
                        toAnswer("3cd65f7e-26fe-102b-80cb-0017a47871b2", "walking", { numericScore: 0, colorCode: EdTriageConcept.score.green } , 'AC'),
                        toAnswer("3cd750a0-26fe-102b-80cb-0017a47871b2", "normal for age", { numericScore: 0, colorCode: EdTriageConcept.score.green } , EdTriageConcept.ageType.INFANT)]
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
                        return { numericScore: 2, colorCode: EdTriageConcept.score.green };;
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
                    return 0;
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
                    if(value < 38.4) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                }),
                consciousness: toAnswers(        'consciousness',
                    [toAnswer("3cf27e66-26fe-102b-80cb-0017a47871b2", "confusion", { numericScore: 2, colorCode: EdTriageConcept.score.green }, 'AC'),
                        toAnswer("160282AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "alert",  { numericScore: 0, colorCode: EdTriageConcept.score.green }),
                        toAnswer("162645AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "reacts to voice", { numericScore: 1, colorCode: EdTriageConcept.score.green }),
                        toAnswer("162644AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "responds to pain", { numericScore: 2, colorCode: EdTriageConcept.score.green }),
                        toAnswer("f7a1fd17-f12d-48c1-b3dd-8e9fc95c8100", "unresponsive",  { numericScore: 3, colorCode: EdTriageConcept.score.green })],
                    GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                trauma: toAnswers('trauma', [toAnswer("124193AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "trauma", function(ageType, value){
                    return value.length > 0 ?  { numericScore: 1, colorCode: EdTriageConcept.score.green } :  { numericScore: 0, colorCode: EdTriageConcept.score.green };})],
                    GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                weight: toAnswer("3ce93b62-26fe-102b-80cb-0017a47871b2", "weight", function(ageType, value){
                    return  { numericScore: 0, colorCode: EdTriageConcept.score.green };
                })
            } ;


            this.symptoms = {
                neurological: toAnswers('neurological',[
                    toAnswer("3cce938e-26fe-102b-80cb-0017a47871b2", "seizure - convulsive",  { numericScore: 0, colorCode: EdTriageConcept.score.red }),
                    toAnswer("ad52aee5-c789-4442-8dfc-2242375f22e8", "seizure - post convulsive",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }),
                    toAnswer("f4433b74-6396-47ff-aa63-3900493ebf23", "acute focal neurologic deficit",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }),
                    toAnswer("eacf7a54-b2fb-4dc1-b2f8-ee0b5926c16c", "level of consciousness reduced",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }),
                    toAnswer("3ccea7fc-26fe-102b-80cb-0017a47871b2", "psychosis",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'AC'),
                    toAnswer("2b436367-c44b-4835-90ad-e93e77d45a97", "infantile hypotonia",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.INFANT),
                    toAnswer("143582AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "prolonged crying",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.INFANT)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                burn: toAnswers('burn',[
                    toAnswer("120977AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "burn - face/head/neck",  { numericScore: 0, colorCode: EdTriageConcept.score.red }),
                    toAnswer("163476AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "significant burn of skin was (burn over 20% or circumferential)",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }),
                    toAnswer("c05b25f1-07d1-47de-a61e-fc9d3bfe95eb", "Burn - electrical or chemical",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }),
                    toAnswer("3ccd21e8-26fe-102b-80cb-0017a47871b2", "burn-other",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow })]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                diabetic: toAnswers('diabetic',[
                    toAnswer("07ece75a-2a53-44ff-be48-15a4f7abc28a", "Ketotic hyperglycemia",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'AC')]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                trauma: toAnswers('trauma',[
                    toAnswer("3b7f125b-6254-4442-be14-f8f6543c8d63", "serious trauma",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }),
                    toAnswer("cef19dbc-e015-4123-9479-986f26a7ca8c", "threatened limb",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT),
                    toAnswer("aca0abff-a38a-4191-a5c4-041fa1809306", "dislocation of larger joint (not finger or toe)",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }),
                    toAnswer("132338AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "open fracture",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }),
                    toAnswer("628ccc25-d0b3-4e73-b01e-1fdd840256bd", "haemorrhage - uncontrolled",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }),
                    toAnswer("6720b77d-b563-44dc-aa17-c9dcb37db8e8", "Cannot support any weight",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.INFANT),
                    toAnswer("a218b3d9-2ead-4fa2-afbd-64849012e125", "dislocation of finger or toe",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }),
                    toAnswer("139899AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "fracture - closed",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }),
                    toAnswer("6807f3b3-4176-49d7-80ff-41603d5c612b", "haemorrhage - controlled",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow })]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                digestive: toAnswers('digestive',[
                    toAnswer("139006AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "vomiting - fresh blood",  { numericScore: 0, colorCode: EdTriageConcept.score.orange}, EdTriageConcept.ageType.ADULT),
                    toAnswer("130334AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "vomiting - persistent",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.ADULT),
                    toAnswer("139582AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "Gastrointestinal hemorrhage",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI'),
                    toAnswer("2d70f8ca-f3dd-4988-8107-9f6b2beb5ff1", "refuses to feed/drink",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.INFANT),
                    toAnswer("3cf1c930-26fe-102b-80cb-0017a47871b2", "Vomiting", { numericScore: 0, colorCode: EdTriageConcept.score.yellow },'CI'),
                    toAnswer("4522ea3d-6045-43d8-a97c-33117191da87", "Persistent diarrhea", { numericScore: 0, colorCode: EdTriageConcept.score.yellow },'CI')]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                pregnancy: toAnswers('pregnancy',[
                    toAnswer("153551AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "pregnancy & abdominal trauma or pain",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }),
                    toAnswer("117617AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "pregnancy & trauma or vaginal bleeding",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow })]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                respiratory: toAnswers('respiratory',[
                    toAnswer("f7ef0b85-6af3-43b9-87a5-5abf89e3a3f5", "hypersalivation",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'CI'),
                    toAnswer("24fa118d-f81d-439d-82a5-d7c6ac6ef72b", "stridor",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'CI'),
                    toAnswer("12d9f052-6980-4542-91ef-190247811228", "shortness of breath - acute",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT),
                    toAnswer("3cf1a95a-26fe-102b-80cb-0017a47871b2", "dyspnea-shortness of breath",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI'),
                    toAnswer("4c1c143e-c1b3-4225-8053-93ab22f7bbb3", "coughing blood ",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT),
                    toAnswer("3ceade68-26fe-102b-80cb-0017a47871b2", "sibilance",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI')]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                pain: toAnswers('pain',[
                    toAnswer("d092c376-5f89-4abd-a6ec-8632587b797b", "severe pain",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }),
                    toAnswer("10008d98-6653-47fb-b171-02e0f257e875", "moderate pain",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }),
                    toAnswer("3ccd2364-26fe-102b-80cb-0017a47871b2", "chest pain",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT),
                    toAnswer("3ccdf8d4-26fe-102b-80cb-0017a47871b2", "abdominal pain",  { numericScore: 0, colorCode: EdTriageConcept.score.orange })
                    ]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                other: toAnswers('other',[
                    toAnswer("3ccccc20-26fe-102b-80cb-0017a47871b2", "toxicity-Poisoning/overdose",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }),
                    toAnswer("15bd52f1-a35b-489d-a283-ece958c4ef1e", "purpura",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI'),
                    toAnswer("8084b7b2-adc4-4b83-aafc-647d1308c988", "drowsiness",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.CHILD),
                    toAnswer("137646AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "incoherent story (or history)",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, 'CI'),
                    toAnswer("148566AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "anuria",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.INFANT)]
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

        function toAnswer(uuid, label, score, scope) {
            var scoreFunction = score;
            if (typeof scoreFunction !== "function") {
                scoreFunction = function(){
                    return score
                };
            }

            return {uuid: uuid, label: label, score: scoreFunction, scope: scope == null ? EdTriageConcept.ageType.ALL : scope, value: null,
            labelTranslated:function(ageType){
                return $filter('translate')(this.label, this.uuid, ageType);
            }};
        }

        function isNumber(obj) {
            return !isNaN(parseFloat(obj));
        }
        
        //some static vars for the scores for symptoms
        EdTriageConcept.score = {
            red: "762ecf40-3065-47aa-93c3-15372d98d393",
            orange: "95d75a4a-cb14-4f1f-b7d5-f53e694b403f",
            yellow: "70763694-61c5-447f-abc3-91f144bfcc0b",
            green: "1d549146-e477-4dcc-9716-11fe4d1cad68"
        };

        EdTriageConcept.status = {
            waitingForEvaluation: "4dd3244d-fcb9-424d-ad8a-afd773c69923",
            outpatientConsultation: "3cdc871e-26fe-102b-80cb-0017a47871b2",
            removed: "45d0c3d2-2188-4186-8a19-0063b92914ee",
            expired: "1fa8d25e-7471-4201-815f-79fac44d9a5f"
        };

        EdTriageConcept.ageType = {
            ADULT: 'A',
            CHILD: 'C',
            INFANT: 'I',
            ALL: 'ACI'
        };

        /**
         * Static method, assigned to class
         * Instance ('this') is not available in static context
         */
        EdTriageConcept.build = function (data, existingConcept) {

            var ret =existingConcept;
            if(existingConcept == null){
                ret = new EdTriageConcept();
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