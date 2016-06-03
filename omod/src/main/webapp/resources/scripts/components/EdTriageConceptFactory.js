angular.module("edTriageConceptFactory", [])
    .factory('EdTriageConcept', ['$filter', function ($filter) {
        var score = {
            red: 1,
            orange: 2,
            yellow: 3,
            green: 4
        };

        /**
         * Constructor, with class name
         */
        function EdTriageConcept() {
            // Public properties, assigned to the instance ('this')
            this.triageQueueStatus = toAnswer("11111111-1111-1111-1111-111111111111", "triageQueueStatus");
            this.admissionLocation = toAnswer("f3e04276-2db0-4181-b937-d73275dc1b15", "admissionLocation");
            this.chiefComplaint = toAnswer("160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "chiefComplaint");
            this.admissionLocation = toAnswer("f3e04276-2db0-4181-b937-d73275dc1b15", "admissionLocation");
            this.vitals = {
                mobility: toAnswers(      'mobility',
                    [toAnswer("11111111-1111-1111-1111-111111111111", "immobile", 2),
                        toAnswer("11111111-1111-1111-1111-111111111111", "with help", 1),
                        toAnswer("11111111-1111-1111-1111-111111111111", "walking", 0, 'AC'),
                        toAnswer("11111111-1111-1111-1111-111111111111", "normal for age", 0, 'I')]),
                respiratoryRate: toAnswer("3ceb11f8-26fe-102b-80cb-0017a47871b2", "respiratoryRate", -1),
                oxygenSaturation: toAnswer("3ce9401c-26fe-102b-80cb-0017a47871b2", "oxygenSaturation", -1),
                heartRate: toAnswer("3ce93824-26fe-102b-80cb-0017a47871b2", "heartRate", -1),
                systolicBloodPressure: toAnswer("3ce934fa-26fe-102b-80cb-0017a47871b2", "systolicBloodPressure", -1),
                diastolicBloodPressure: toAnswer("3ce93694-26fe-102b-80cb-0017a47871b2", "diastolicBloodPressure", -1),
                temperature: toAnswer("3ce939d2-26fe-102b-80cb-0017a47871b2", "temperature", -1),
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
                    toAnswer("3cce938e-26fe-102b-80cb-0017a47871b2", "Seizure - convulsive", score.red),
                    toAnswer("seizure_post_convulsive_uuid_goes_here", "Seizure - post convulsive", score.orange),
                    toAnswer("focal_neurology_acute_stroke__uuid_goes_here", "Focal Neurology Acute Stroke", score.orange),
                    toAnswer("level_of_consciousness_reduced_uuid_goes_here", "Level of consciousness reduced", score.orange),
                    toAnswer("psychosis_aggression_uuid_goes_here", "Psychosis Aggression", score.orange),
                    toAnswer("Infantile hypotonia_uuid_goes_here", "Infantile hypotonia", score.orange),
                    toAnswer(none_concept_uuid, "None", score.green),
                    toAnswer(unknown_concept_uuid, "Uknown", score.green)]),
                burn: toAnswers('burn',[
                    toAnswer("Burn - facial/inhalation uuid_goes_here", "Burn - facial/inhalation", score.red),
                    toAnswer("Burn over 20% or circumferential uuid_goes_here ", "Burn over 20% or circumferential", score.orange),
                    toAnswer("Burn over 10% or circumferential uuid_goes_here", "Burn over 10% or circumferential", score.orange),
                    toAnswer("Burn - electrical or chemical uuid_goes_here", "Burn - electrical or chemical", score.orange),
                    toAnswer("Burn - other uuid_goes_here", "Burn - other", score.yellow),
                    toAnswer(none_concept_uuid, "None", score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", score.green)]),
                trauma: toAnswers('trauma',[
                    toAnswer("Serious trauma uuid_goes_here", "Serious trauma", score.orange),
                    toAnswer("Threatened limb uuid_goes_here ", "Threatened limb", score.orange),
                    toAnswer("Dislocation of larger joint (not finger or toe) uuid_goes_here", "Dislocation of larger joint (not finger or toe)", score.orange),
                    toAnswer("Fracture - open uuid_goes_here", "Fracture - open", score.orange),
                    toAnswer("Haemorrhage - uncontrolled uuid_goes_here", "Haemorrhage - uncontrolled", score.orange),
                    toAnswer("Cannot support any weight uuid_goes_here", "Cannot support any weight", score.yellow),
                    toAnswer("Dislocation of finger or toe uuid_goes_here", "Dislocation of finger or toe", score.yellow),
                    toAnswer("Fracture - closed uuid_goes_here", "Fracture - closed", score.yellow),
                    toAnswer("Haemorrhage - controlled uuid_goes_here", "Haemorrhage - controlled", score.yellow),
                    toAnswer(none_concept_uuid, "None", score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", score.green)]),
                digestive: toAnswers('digestive',[
                    toAnswer("Vomiting - fresh blood uuid_goes_here", "Vomiting - fresh blood", score.orange),
                    toAnswer("Vomiting - persistent uuid_goes_here ", "Vomiting - persistent", score.yellow),
                    toAnswer("Refuses to feed/drink uuid_goes_here", "Refuses to feed/drink", score.yellow),
                    toAnswer(none_concept_uuid, "None", score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", score.green)]),
                pregnancy: toAnswers('pregnancy',[
                    toAnswer("Pregnancy & abdominal trauma or pain uuid_goes_here", "Pregnancy & abdominal trauma or pain", score.orange),
                    toAnswer("Pregnancy & trauma or vaginal bleeding uuid_goes_here", "Pregnancy & trauma or vaginal bleeding uuid_goes_here", score.yellow),
                    toAnswer(none_concept_uuid, "None", score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", score.green)]),
                respiratory: toAnswers('respiratory',[
                    toAnswer("Hypersalivation uuid_goes_here", "Hypersalivation", score.orange),
                    toAnswer("Stridor uuid_goes_here ", "Stridor", score.yellow),
                    toAnswer("Oxygen < 85% uuid_goes_here uuid_goes_here", "Oxygen < 85%", score.yellow),
                    toAnswer("Shortness of breath - acute uuid_goes_here", "Shortness of breath - acute", score.yellow),
                    toAnswer("Shortness of breath uuid_goes_here", "Shortness of breath", score.yellow),
                    toAnswer("Coughing blood uuid_goes_here", "Coughing blood ", score.yellow),
                    toAnswer("Sibilance uuid_goes_here", "Sibilance", score.yellow),
                    toAnswer(none_concept_uuid, "None", score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", score.green)]),
                pain: toAnswers('pain',[
                    toAnswer("Hypersalivation uuid_goes_here", "Hypersalivation", score.orange),
                    toAnswer("Severe pain uuid_goes_here ", "Severe pain", score.yellow),
                    toAnswer("Moderate pain uuid_goes_here ", "Moderate pain", score.orange),
                    toAnswer("Mild pain uuid_goes_here ", "Mild pain", score.yellow),
                    toAnswer("Chest pain uuid_goes_here ", "Chest pain", score.orange),
                    toAnswer("Abdominal pain uuid_goes_here ", "Abdominal pain", score.orange),
                    toAnswer("Other pain uuid_goes_here ", "Other pain", score.yellow),
                    toAnswer(none_concept_uuid, "None", score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", score.green)]),
                other: toAnswers('other',[
                    toAnswer("Poisoning/overdose uuid_goes_here ", "Poisoning/overdose", score.yellow),
                    toAnswer("Purpura uuid_goes_here ", "Purpura", score.yellow),
                    toAnswer("Drowsiness uuid_goes_here ", "Drowsiness", score.yellow),
                    toAnswer("Incoherent story (or history) uuid_goes_here ", "Incoherent story (or history)", score.yellow),
                    toAnswer("Anuria uuid_goes_here ", "Anuria", score.yellow),
                    toAnswer("Diabetic: Glucose < 60 uuid_goes_here ", "Diabetic: Glucose < 60", score.yellow),
                    toAnswer("Diabetic: Hypoglycemia < 54 uuid_goes_here ", "Diabetic: Hypoglycemia < 54", score.yellow),
                    toAnswer("Diabetic: Glucose > 200 & ketonuria uuid_goes_here ", "Diabetic: Glucose > 200 & ketonuria", score.yellow),
                    toAnswer("Diabetic: Glucose > 300 & (no ketonuria) uuid_goes_here ", "Diabetic: Glucose > 300 & (no ketonuria) ", score.yellow),
                    toAnswer(none_concept_uuid, "None", score.green),
                    toAnswer(unknown_concept_uuid, "Unknown", score.green)])

            }
        }

        function toAnswers(messageKey, answers) {
            var key = "edtriageapp.i18n." + messageKey;
            var translation = $filter('translate')(key);
            //TODO:  this is just until we figure out the translations, so things are sort of readable
            if(key == translation){
                translation = key.split(".")[2] + "{??}";
            }
            return {answers: answers, label:translation, value: null};
        }

        function toAnswer(uuid, label, score, scope) {
            return {uuid: uuid, label: label, score: score, scope: scope == null ? 'ACI' : scope, value: null};
        }

        /**
         * Static method, assigned to class
         * Instance ('this') is not available in static context
         */
        EdTriageConcept.build = function (data) {

            var ret = new EdTriageConcept();

            console.log(ret);

            updateConceptLabels(ret, data, 0);

            return ret;

            function updateConceptLabels(obj, data, level) {
                for (var propertyName in obj) {
                    var p = obj[propertyName];
                    if (p != null && typeof p == "object") {
                        if (p.hasOwnProperty('uuid')) {
                            //this an answer to a question, so let's look for a UUID that matches in the data and set the label for this
                            updateAnswerLabel(p, data)
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
                        console.log("skipping the prop=" + propertyName + " at " + level);
                    }

                }
            }

            function updateAnswerLabel(obj, data) {
                for (var i = 0; i < data.length; ++i) {
                    var concept = data[i];
                    if (concept.uuid == obj.uuid) {
                        obj.label = concept.display;
                        return;
                    }
                }
            }
        };



        /**
         * Return the constructor function
         */
        return EdTriageConcept;
    }]);