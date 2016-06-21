angular.module("edTriageConceptFactory", [])
    .factory('EdTriageConcept', ['$filter', function ($filter) {
        /**
         * Constructor, with class name
         */
        function EdTriageConcept() {
            var none_concept_uuid = "3cd743f8-26fe-102b-80cb-0017a47871b2";
            var unknown_concept_uuid = "3cd6fac4-26fe-102b-80cb-0017a47871b2";
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
            this.vitals = {
                mobility: toAnswers(      'mobility',
                    [toAnswer("38b69221-d8c5-41ca-81fb-258469bdf519", "immobile", 2),
                        toAnswer("d335ec09-c724-4327-9726-f3c984bb1ca1", "with help", 1),
                        toAnswer("3cd65f7e-26fe-102b-80cb-0017a47871b2", "walking", 0, 'AC'),
                        toAnswer("3cd750a0-26fe-102b-80cb-0017a47871b2", "normal for age", 0, 'I')]
                    , "611e7b0a-5b34-47ac-b352-02c2dc653255"),
                respiratoryRate: toAnswer("3ceb11f8-26fe-102b-80cb-0017a47871b2", "respiratoryRate", function(ageType, value){
                    if(ageType == 'A'){
                        if(value < 9) return 2;
                        if(value < 15) return 0;
                        if(value < 21) return 1;
                        if(value < 30) return 2;
                        return 3;
                    }
                    if(ageType == 'C'){
                        if(value < 15) return 3;
                        if(value < 17) return 2;
                        if(value < 22) return 0;
                        if(value < 27) return 1;
                        return 2;
                    }
                    if(ageType == 'I'){
                        if(value < 20) return 3;
                        if(value < 26) return 2;
                        if(value < 40) return 0;
                        if(value < 50) return 2;
                        return 3;
                    }


                }),
                oxygenSaturation: toAnswer("3ce9401c-26fe-102b-80cb-0017a47871b2", "oxygenSaturation", function(ageType, value){return 0;}),
                heartRate: toAnswer("3ce93824-26fe-102b-80cb-0017a47871b2", "heartRate", function(ageType, value){
                    if(ageType == 'A'){
                        if(value < 41) return 2;
                        if(value < 51) return 1;
                        if(value < 101) return 0;
                        if(value < 111) return 1;
                        if(value < 3130) return 2;
                        return 3;
                    }
                    if(ageType == 'C'){
                        if(value < 60) return 3;
                        if(value < 80) return 2;
                        if(value < 100) return 0;
                        if(value < 130) return 1;
                        return 2;
                    }
                    if(ageType == 'I'){
                        if(value < 70) return 3;
                        if(value < 80) return 2;
                        if(value < 131) return 0;
                        if(value < 160) return 1;
                        return 2;
                    }
                }),
                systolicBloodPressure: toAnswer("3ce934fa-26fe-102b-80cb-0017a47871b2", "systolicBloodPressure", function(ageType, value){return 0;}),
                diastolicBloodPressure: toAnswer("3ce93694-26fe-102b-80cb-0017a47871b2", "diastolicBloodPressure", function(ageType, value){return 0;}),
                temperature: toAnswer("3ce939d2-26fe-102b-80cb-0017a47871b2", "temperature", function(ageType, value){return 0;}),
                consciousness: toAnswers(        'consciousness',
                    [toAnswer("3cf27e66-26fe-102b-80cb-0017a47871b2", "confusion", 2, 'AC'),
                        toAnswer("160282AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "alert", 0),
                        toAnswer("162645AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "reacts to voice", 1),
                        toAnswer("162644AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "responds to pain", 2),
                        toAnswer("f7a1fd17-f12d-48c1-b3dd-8e9fc95c8100", "unresponsive", 3)],GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                trauma: toAnswer("124193AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "trauma", function(ageType, value){return value>0?1:0;}),
                weight: toAnswer("3ce93b62-26fe-102b-80cb-0017a47871b2", "weight", function(ageType, value){return 0;})
            } ;


            this.symptoms = {
                neurological: toAnswers('neurological',[
                    toAnswer("3cce938e-26fe-102b-80cb-0017a47871b2", "Seizure - convulsive", EdTriageConcept.score.red),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Seizure - post convulsive", EdTriageConcept.score.orange),
                    toAnswer("f4433b74-6396-47ff-aa63-3900493ebf23", "acute focal neurologic deficit", EdTriageConcept.score.orange),
                    toAnswer("eacf7a54-b2fb-4dc1-b2f8-ee0b5926c16c", "level of consciousness reduced", EdTriageConcept.score.orange),
                    toAnswer("3ccea7fc-26fe-102b-80cb-0017a47871b2", "psychosis", EdTriageConcept.score.orange, 'AC'),
                    toAnswer("2b436367-c44b-4835-90ad-e93e77d45a97", "infantile hypotonia", EdTriageConcept.score.orange, 'I'),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Uknown", EdTriageConcept.score.green)],GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                burn: toAnswers('burn',[
                    toAnswer("120977AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "burn - face/head/neck", EdTriageConcept.score.red),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Burn over 20% or circumferential", EdTriageConcept.score.orange, 'A'),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Burn over 10% or circumferential", EdTriageConcept.score.orange, 'CI'),
                    toAnswer("c05b25f1-07d1-47de-a61e-fc9d3bfe95eb", "Burn - electrical or chemical", EdTriageConcept.score.orange),
                    toAnswer("3ccd21e8-26fe-102b-80cb-0017a47871b2", "burn-other", EdTriageConcept.score.yellow),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)],GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                trauma: toAnswers('trauma',[
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Serious trauma", EdTriageConcept.score.orange),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Threatened limb", EdTriageConcept.score.orange, 'A'),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Dislocation of larger joint (not finger or toe)", EdTriageConcept.score.orange),
                    toAnswer("132338AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "open fracture", EdTriageConcept.score.orange),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Haemorrhage - uncontrolled", EdTriageConcept.score.orange),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Cannot support any weight", EdTriageConcept.score.yellow, 'I'),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Dislocation of finger or toe", EdTriageConcept.score.yellow),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Fracture - closed", EdTriageConcept.score.yellow),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Haemorrhage - controlled", EdTriageConcept.score.yellow),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)],GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                digestive: toAnswers('digestive',[
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Vomiting - fresh blood", EdTriageConcept.score.orange),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Vomiting - persistent", EdTriageConcept.score.yellow),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Refuses to feed/drink", EdTriageConcept.score.yellow, 'I'),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)],GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                pregnancy: toAnswers('pregnancy',[
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Pregnancy & abdominal trauma or pain", EdTriageConcept.score.orange),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Pregnancy & trauma or vaginal bleeding uuid_goes_here", EdTriageConcept.score.yellow),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)],GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                respiratory: toAnswers('respiratory',[
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Hypersalivation", EdTriageConcept.score.red, 'I'),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Stridor", EdTriageConcept.score.red, 'CI'),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Oxygen < 85%", EdTriageConcept.score.red),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Shortness of breath - acute", EdTriageConcept.score.orange, 'A'),
                    toAnswer("3cf1a95a-26fe-102b-80cb-0017a47871b2", "Dyspnea-shortness of breath", EdTriageConcept.score.yellow, 'CI'),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Coughing blood ", EdTriageConcept.score.orange, 'A   '),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Sibilance", EdTriageConcept.score.orange, 'CI'),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)],GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                pain: toAnswers('pain',[
                    toAnswer("Severe pain uuid_goes_here ", "(TBD)Severe pain", EdTriageConcept.score.orange),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Moderate pain", EdTriageConcept.score.yellow),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Mild pain", EdTriageConcept.score.green),
                    toAnswer("3ccd2364-26fe-102b-80cb-0017a47871b2", "chest pain", EdTriageConcept.score.orange, 'A'),
                    toAnswer("3ccdf8d4-26fe-102b-80cb-0017a47871b2", "abdominal pain", EdTriageConcept.score.yellow),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Other pain", EdTriageConcept.score.green),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)],GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                other: toAnswers('other',[
                    toAnswer("3ccccc20-26fe-102b-80cb-0017a47871b2", "toxicity-Poisoning/overdose", EdTriageConcept.score.orange),
                    toAnswer("15bd52f1-a35b-489d-a283-ece958c4ef1e", "purpura", EdTriageConcept.score.orange, 'CI'),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Drowsiness", EdTriageConcept.score.orange, 'C'),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Incoherent story (or history)", EdTriageConcept.score.yellow, 'CI'),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Anuria", EdTriageConcept.score.yellow, 'I'),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Diabetic: Glucose < 60", EdTriageConcept.score.red, 'AC'),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Diabetic: Hypoglycemia < 54", EdTriageConcept.score.red, 'I'),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Diabetic: Glucose > 200 & ketonuria", EdTriageConcept.score.orange, 'AC'),
                    toAnswer("11111111-1111-1111-1111-111111111111", "(TBD)Diabetic: Glucose > 300 & (no ketonuria) ", EdTriageConcept.score.yellow, 'AC'),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)],GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID)

            }
        }

        function toAnswers(messageKey, answers, uuid) {
            var key = "edtriageapp.i18n." + messageKey;
            var translation = $filter('translate')(key);
            //TODO:  this is just until we figure out the translations, so things are sort of readable
            if(key == translation){
                translation = key.split(".")[2] + "{??}";
            }
            return {answers: answers, label:translation, value: null, uuid:uuid};
        }

        function toAnswer(uuid, label, score, scope) {
            var scoreFunction = score;
            if (typeof scoreFunction !== "function") {
                scoreFunction = function(){return score};
            }

            return {uuid: uuid, label: label, score: scoreFunction, scope: scope == null ? 'ACI' : scope, value: null};
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