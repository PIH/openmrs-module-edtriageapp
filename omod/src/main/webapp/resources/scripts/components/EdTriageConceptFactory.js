angular.module("edTriageConceptFactory", [])
    .factory('EdTriageConcept', ['$filter', function ($filter) {
        /**
         * Constructor, with class name
         */
        function EdTriageConcept() {
            var none_concept_uuid = "3cd743f8-26fe-102b-80cb-0017a47871b2";
            var unknown_concept_uuid = "3cd6fac4-26fe-102b-80cb-0017a47871b2";
            // Public properties, assigned to the instance ('this')
            this.triageQueueStatus =  toAnswers("triageQueueStatus", [
                    toAnswer("4dd3244d-fcb9-424d-ad8a-afd773c69923", "waitingForEvaluation"),
                    toAnswer("3cdc871e-26fe-102b-80cb-0017a47871b2", "outpatientConsultation"),
                    toAnswer("45d0c3d2-2188-4186-8a19-0063b92914ee", "remove"),
                    toAnswer("1fa8d25e-7471-4201-815f-79fac44d9a5f", "expire")]
                , "66c18ba5-459e-4049-94ab-f80aca5c6a98");
            this.triageQueueStatus =  toAnswers("triageQueueStatus", [
                    toAnswer("4dd3244d-fcb9-424d-ad8a-afd773c69923", "waitingForEvaluation"),
                    toAnswer("3cdc871e-26fe-102b-80cb-0017a47871b2", "outpatientConsultation"),
                    toAnswer("45d0c3d2-2188-4186-8a19-0063b92914ee", "remove"),
                    toAnswer("1fa8d25e-7471-4201-815f-79fac44d9a5f", "expire")]
                , "66c18ba5-459e-4049-94ab-f80aca5c6a98");
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
                    [toAnswer("11111111-1111-1111-1111-111111111111", "confused", 2, 'AC'),
                        toAnswer("11111111-1111-1111-1111-111111111111", "alert", 0),
                        toAnswer("11111111-1111-1111-1111-111111111111", "reacts to voice", 1),
                        toAnswer("11111111-1111-1111-1111-111111111111", "reacts to pain", 2),
                        toAnswer("11111111-1111-1111-1111-111111111111", "unresponsive", 3)]),
                trauma: toAnswers(    'toAnswers',
                    [toAnswer("11111111-1111-1111-1111-111111111111", "yes", 1),
                        toAnswer("11111111-1111-1111-1111-111111111111", "no", 0)]),
                weight: toAnswer("3ce93b62-26fe-102b-80cb-0017a47871b2", "weight")
            } ;


            this.symptoms = {
                neurological: toAnswers('neurological',[
                    toAnswer("3cce938e-26fe-102b-80cb-0017a47871b2", "Seizure - convulsive", EdTriageConcept.score.red),
                    toAnswer("seizure_post_convulsive_uuid_goes_here", "Seizure - post convulsive", EdTriageConcept.score.orange),
                    toAnswer("focal_neurology_acute_stroke__uuid_goes_here", "Focal Neurology Acute Stroke", EdTriageConcept.score.orange),
                    toAnswer("level_of_consciousness_reduced_uuid_goes_here", "Level of consciousness reduced", EdTriageConcept.score.orange),
                    toAnswer("psychosis_aggression_uuid_goes_here", "Psychosis Aggression", EdTriageConcept.score.orange),
                    toAnswer("Infantile hypotonia_uuid_goes_here", "Infantile hypotonia", EdTriageConcept.score.orange),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Uknown", EdTriageConcept.score.green)]),
                burn: toAnswers('burn',[
                    toAnswer("Burn - facial/inhalation uuid_goes_here", "Burn - facial/inhalation", EdTriageConcept.score.red),
                    toAnswer("Burn over 20% or circumferential uuid_goes_here ", "Burn over 20% or circumferential", EdTriageConcept.score.orange),
                    toAnswer("Burn over 10% or circumferential uuid_goes_here", "Burn over 10% or circumferential", EdTriageConcept.score.orange),
                    toAnswer("Burn - electrical or chemical uuid_goes_here", "Burn - electrical or chemical", EdTriageConcept.score.orange),
                    toAnswer("Burn - other uuid_goes_here", "Burn - other", EdTriageConcept.score.yellow),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)]),
                trauma: toAnswers('trauma',[
                    toAnswer("Serious trauma uuid_goes_here", "Serious trauma", EdTriageConcept.score.orange),
                    toAnswer("Threatened limb uuid_goes_here ", "Threatened limb", EdTriageConcept.score.orange),
                    toAnswer("Dislocation of larger joint (not finger or toe) uuid_goes_here", "Dislocation of larger joint (not finger or toe)", EdTriageConcept.score.orange),
                    toAnswer("Fracture - open uuid_goes_here", "Fracture - open", EdTriageConcept.score.orange),
                    toAnswer("Haemorrhage - uncontrolled uuid_goes_here", "Haemorrhage - uncontrolled", EdTriageConcept.score.orange),
                    toAnswer("Cannot support any weight uuid_goes_here", "Cannot support any weight", EdTriageConcept.score.yellow),
                    toAnswer("Dislocation of finger or toe uuid_goes_here", "Dislocation of finger or toe", EdTriageConcept.score.yellow),
                    toAnswer("Fracture - closed uuid_goes_here", "Fracture - closed", EdTriageConcept.score.yellow),
                    toAnswer("Haemorrhage - controlled uuid_goes_here", "Haemorrhage - controlled", EdTriageConcept.score.yellow),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)]),
                digestive: toAnswers('digestive',[
                    toAnswer("Vomiting - fresh blood uuid_goes_here", "Vomiting - fresh blood", EdTriageConcept.score.orange),
                    toAnswer("Vomiting - persistent uuid_goes_here ", "Vomiting - persistent", EdTriageConcept.score.yellow),
                    toAnswer("Refuses to feed/drink uuid_goes_here", "Refuses to feed/drink", EdTriageConcept.score.yellow),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)]),
                pregnancy: toAnswers('pregnancy',[
                    toAnswer("Pregnancy & abdominal trauma or pain uuid_goes_here", "Pregnancy & abdominal trauma or pain", EdTriageConcept.score.orange),
                    toAnswer("Pregnancy & trauma or vaginal bleeding uuid_goes_here", "Pregnancy & trauma or vaginal bleeding uuid_goes_here", EdTriageConcept.score.yellow),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)]),
                respiratory: toAnswers('respiratory',[
                    toAnswer("Hypersalivation uuid_goes_here", "Hypersalivation", EdTriageConcept.score.orange),
                    toAnswer("Stridor uuid_goes_here ", "Stridor", EdTriageConcept.score.yellow),
                    toAnswer("Oxygen < 85% uuid_goes_here uuid_goes_here", "Oxygen < 85%", EdTriageConcept.score.yellow),
                    toAnswer("Shortness of breath - acute uuid_goes_here", "Shortness of breath - acute", EdTriageConcept.score.yellow),
                    toAnswer("Shortness of breath uuid_goes_here", "Shortness of breath", EdTriageConcept.score.yellow),
                    toAnswer("Coughing blood uuid_goes_here", "Coughing blood ", EdTriageConcept.score.yellow),
                    toAnswer("Sibilance uuid_goes_here", "Sibilance", EdTriageConcept.score.yellow),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)]),
                pain: toAnswers('pain',[
                    toAnswer("Hypersalivation uuid_goes_here", "Hypersalivation", EdTriageConcept.score.orange),
                    toAnswer("Severe pain uuid_goes_here ", "Severe pain", EdTriageConcept.score.yellow),
                    toAnswer("Moderate pain uuid_goes_here ", "Moderate pain", EdTriageConcept.score.orange),
                    toAnswer("Mild pain uuid_goes_here ", "Mild pain", EdTriageConcept.score.yellow),
                    toAnswer("Chest pain uuid_goes_here ", "Chest pain", EdTriageConcept.score.orange),
                    toAnswer("Abdominal pain uuid_goes_here ", "Abdominal pain", EdTriageConcept.score.orange),
                    toAnswer("Other pain uuid_goes_here ", "Other pain", EdTriageConcept.score.yellow),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)]),
                other: toAnswers('other',[
                    toAnswer("Poisoning/overdose uuid_goes_here ", "Poisoning/overdose", EdTriageConcept.score.yellow),
                    toAnswer("Purpura uuid_goes_here ", "Purpura", EdTriageConcept.score.yellow),
                    toAnswer("Drowsiness uuid_goes_here ", "Drowsiness", EdTriageConcept.score.yellow),
                    toAnswer("Incoherent story (or history) uuid_goes_here ", "Incoherent story (or history)", EdTriageConcept.score.yellow),
                    toAnswer("Anuria uuid_goes_here ", "Anuria", EdTriageConcept.score.yellow),
                    toAnswer("Diabetic: Glucose < 60 uuid_goes_here ", "Diabetic: Glucose < 60", EdTriageConcept.score.yellow),
                    toAnswer("Diabetic: Hypoglycemia < 54 uuid_goes_here ", "Diabetic: Hypoglycemia < 54", EdTriageConcept.score.yellow),
                    toAnswer("Diabetic: Glucose > 200 & ketonuria uuid_goes_here ", "Diabetic: Glucose > 200 & ketonuria", EdTriageConcept.score.yellow),
                    toAnswer("Diabetic: Glucose > 300 & (no ketonuria) uuid_goes_here ", "Diabetic: Glucose > 300 & (no ketonuria) ", EdTriageConcept.score.yellow),
                    toAnswer(none_concept_uuid, "None", EdTriageConcept.score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", EdTriageConcept.score.green)])

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
            return {uuid: uuid, label: label, score: score, scope: scope == null ? 'ACI' : scope, value: null};
        }

        //some static vars for the scores for symptoms
        EdTriageConcept.score = {
            red: 1,
            orange: 2,
            yellow: 3,
            green: 4
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

            function updateConceptLabels(obj, data, level) {
                for (var propertyName in obj) {
                    var p = obj[propertyName];


                    console.log(propertyName);
                    if(propertyName == 'respiratoryRate'){
                        console.log("found");
                    }
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
                        //console.log("skipping the prop=" + propertyName + " at " + level);
                    }

                }
            }

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
            for (var propertyName in obj) {
                var p = obj[propertyName];
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
                    //console.log("skipping the prop=" + propertyName + " at " + level);
                }

            }
        } ;


        /**
         * Return the constructor function
         */
        return EdTriageConcept;
    }]);