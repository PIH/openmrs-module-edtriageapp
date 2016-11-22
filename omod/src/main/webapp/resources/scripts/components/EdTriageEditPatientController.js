angular.module("edTriagePatientController", [])
    .controller("patientEditController", ['$scope', '$filter', '$element', '$timeout','EdTriageDataService', 'EdTriageConcept',
        'patientUuid', 'patientDashboard', 'ngDialog', 'patientBirthDate', 'patientGender', 'locationUuid', 'encounterUuid', 'returnUrl', 'editable',
        function ($scope, $filter, $element, $timeout, EdTriageDataService, EdTriageConcept, patientUuid, patientDashboard, ngDialog, patientBirthDate,
                  patientGender, locationUuid, encounterUuid, returnUrl, editable) {
            $scope.loading_complete = false;//used to tell if we when all the data has been loaded
            $scope.isSaving = false; // used to determine if we should disable things
            $scope.debug = false; // if true, will show debug info on client
            // $scope.traumaString = "";
            $scope.weightInKg = null;
            $scope.weightInLb = null;
            $scope.tempInC = null;
            $scope.tempInF = null;
            $scope.editable = editable ? editable : false;
            $scope.patientDashboard = patientDashboard;

            /* helper function to get the color class for the score
             * @param {String} colorCode - the uuid for the color
             * @return the class suffix
             * */
            $scope.getColorClassFromScore = function(answerUuid){
                var color = null;
                var score = $scope.getScore(answerUuid);
                if (score) {
                    color = EdTriageDataService.getColorClass(score.colorCode);

                }
                if (color == "green") {
                    color = "score";
                }
                if (color == null) {
                    color = "white";
                }

                return color;
            };

            /* helper function to get the color class for the score
             * @param {String} colorCode - the uuid for the color
             * @return the class suffix
             * */
            $scope.getColorClass = function(colorCode){
                return EdTriageDataService.getColorClass(colorCode);
            };

            /* determines if a score is numeric or a color
            * @param {String} the concept UUID
            * @return true if it is a number
            * */
            $scope.isNumericScore = function(uuid){
                var v = $scope.getScore(uuid);
                return v*1==v;
            };

            /* gets the score
             * @param {String} the concept UUID
             * @return the score
             * */
            $scope.getScore = function(uuid){
                if(uuid === undefined || $scope.currentScore === undefined ){
                    return null;
                }
                return $scope.currentScore.individualScores[uuid];
            };

            /* navigates to the find patient page*/
            $scope.cancel = function(){
                if (returnUrl) {
                    emr.navigateTo({ url: returnUrl });
                }
                else {
                    emr.navigateTo({ applicationUrl:  EdTriageDataService.CONSTANTS.URLS.FIND_PATIENT });
                }
            };

            $scope.confirmSave = function () {

                if ($scope.edTriagePatient.areVitalsComplete() && $scope.edTriagePatient.atLeastOneSymptomPresent()) {
                    $scope.save();
                }
                else {
                    ngDialog.openConfirm({
                        showClose: true,
                        closeByEscape: true,
                        template: "edtriageConfirmSubmit.page",
                        controller: ["$scope", function($dialogScope) {
                            $dialogScope.vitalsNotComplete = !$scope.edTriagePatient.areVitalsComplete();
                            $dialogScope.noSymptons = !$scope.edTriagePatient.atLeastOneSymptomPresent();
                        }]
                    }).then($scope.save)
                }

            };

            /*
             * the main save function, will return a message in the UI
             * */
            $scope.save = function () {

                $scope.isSaving = true;

                // we set the status back to "waiting for evaluation" on save if the status is expired or removed
                if (!$scope.edTriagePatient.triageQueueStatus.value ||
                    $scope.edTriagePatient.triageQueueStatus.value == EdTriageConcept.status.expired ||
                    $scope.edTriagePatient.triageQueueStatus.value == EdTriageConcept.status.removed ||
                    $scope.edTriagePatient.triageQueueStatus.value == EdTriageConcept.status.leftWithoutBeingSeen) {
                    $scope.edTriagePatient.triageQueueStatus.value = EdTriageConcept.status.waitingForEvaluation;
                }

                EdTriageDataService.save($scope.edTriagePatientConcept, $scope.edTriagePatient).then(function (res) {
                    if (res.status != 200) {
                        // TODO better error handling here?
                        $scope.message = {type: 'danger', text: $filter('json')(res)};
                        $scope.isSaving = false;
                    }
                    else {
                        if (returnUrl) {
                            emr.navigateTo({url: returnUrl});
                        }
                        else {
                            emr.navigateTo({applicationUrl: EdTriageDataService.CONSTANTS.URLS.FIND_PATIENT});
                        }
                    }
                });
            };


            $scope.isWaitingForConsult = function() {
                return $scope.edTriagePatient &&
                    $scope.edTriagePatient.triageQueueStatus &&
                    $scope.edTriagePatient.triageQueueStatus.value == EdTriageConcept.status.waitingForEvaluation;
            }

            $scope.hasExistingEncounter = function() {
                return $scope.edTriagePatient.encounterUuid ? true : false;
            }

            /*
             * the changes the status of the observation to consult
             * */
            $scope.beginConsult = function () {

                ngDialog.openConfirm({
                    showClose: true,
                    closeByEscape: true,
                    template: "edtriageConfirmBeginConsult.page"
                }).then(function() {

                    $scope.isSaving = true;

                    return EdTriageDataService.beginConsult($scope.edTriagePatientConcept, $scope.edTriagePatient).then(function (res) {
                        if (res.status != 200) {
                            $scope.message = {type: 'danger', text: "The system was not able to update the record"};
                            $scope.isSaving = false;
                        }
                        else {
                            var url = $scope.patientDashboard.replace("{{patientId}}", $scope.edTriagePatient.patient.uuid);
                            emr.navigateTo({applicationUrl: url});
                        }
                    });
                })
            };

            /* handles converting the weight from kg to lb and back
            * @param {String} convType = the type of converstion (kg, lb)
            * */
            $scope.handleWeightChange = function(convType){
                var CONVERSTION_FACTOR = 2.2;
                if(convType == 'kg'){
                    if($scope.weightInKg  == null){
                        $scope.weightInLb = null;
                        $scope.edTriagePatient.vitals.weight = null;
                        return;
                    }
                    $scope.weightInLb = Math.round($scope.weightInKg*CONVERSTION_FACTOR);
                }
                else{
                    if($scope.weightInLb  == null){
                        $scope.weightInKg = null;
                        $scope.edTriagePatient.vitals.weight = null;
                        return;
                    }
                    $scope.weightInKg =   Math.round($scope.weightInLb/CONVERSTION_FACTOR);
                }
                $scope.edTriagePatient.vitals.weight = {concept:$scope.edTriagePatientConcept.vitals.weight.uuid, value:$scope.weightInKg};

            };

            /* handles converting the temp from C to F
             * @param {String} convType = the type of converstion (c, f)
             * */
            $scope.handleTempChange = function(convType){
                if(convType == 'c'){
                    if($scope.tempInC  == null){
                        $scope.tempInF = null;
                        $scope.edTriagePatient.vitals.temperature = null;
                        return;
                    }
                    $scope.tempInF = Math.round((($scope.tempInC * (9/5)) + 32)*10)/10;
                }
                else{
                    if($scope.tempInF  == null){
                        $scope.tempInC = null;
                        $scope.edTriagePatient.vitals.temperature = null;
                        return;
                    }
                    $scope.tempInC =   Math.round((($scope.tempInF - 32) * 5 / 9)*10)/10;
                }
                $scope.edTriagePatient.vitals.temperature = {concept:$scope.edTriagePatientConcept.vitals.temperature.uuid, value:$scope.tempInC};

            };

            /* helper function for finding an answer for a question in the concept def
             * @param {EdTriageConcept} concept - the concepts
             * @param {String} uuid - the answer UUID
             * @return the answer label
             * */
            $scope.findAnswerLabel = function(concept, uuid){
                var ret = $filter('findAnswer')(concept, uuid);
                if(ret != null){
                    ret =  ret.label;
                }
                else{
                    ret = null;
                }
                return ret;
            };
            /*
             * watches the main model for changes and updates the score
             * */
            $scope.$watch('edTriagePatient', function (newValue, oldValue) {
                if ($scope.edTriagePatientConcept != null && newValue != null) {
                    EdTriageDataService.calculate($scope.edTriagePatientConcept, newValue);
                    $scope.currentScore.numericScore = $scope.edTriagePatient.score.numericScore;
                    $scope.currentScore.individualScores = $scope.edTriagePatient.score.individualScores;
                    $scope.currentScore.numericScore = $scope.edTriagePatient.score.numericScore;
                    $scope.currentScore.colorCode = $scope.edTriagePatient.score.colorCode;
                    $scope.currentScore.colorClass = $scope.getColorClass($scope.currentScore.colorCode);
                    // $scope.traumaString=$scope.edTriagePatient.symptoms.trauma==null?"":$scope.edTriagePatient.symptoms.trauma.value;

                }

            }, true);

            /* sets the focus on an element
            * @param {String} id - the HMTL dom id
            * @return none
            * */
            $scope.setFocus = function(id){
                var input = $element.find(id);
                if (input) {
                    $timeout(function() {
                        input.focus();
                    });
                }
            }          ;

            $scope.sortAnswer = function(answer){
                return answer.displayOrder;
            };


            /* ---------------------------------------------------------
            *  page initialization code starts here
            * -------------------------------------------------------- */
            //load the data for the page here
            EdTriageDataService.loadConcept().then(function (concept) {
                var birthDate = new Date($filter('serverDate')(patientBirthDate));
                EdTriageDataService.load(concept, patientUuid, birthDate, patientGender, locationUuid, encounterUuid).then(function (data) {
                    EdTriageDataService.calculate(concept, data);
                    $scope.edTriagePatientConcept = concept;
                    $scope.edTriagePatient = data;
                    if($scope.edTriagePatient.vitals.weight){
                        $scope.weightInKg = Math.round($scope.edTriagePatient.vitals.weight.value);
                        $scope.handleWeightChange('kg');
                    }

                    if($scope.edTriagePatient.vitals.temperature){
                        $scope.tempInC = Math.round($scope.edTriagePatient.vitals.temperature.value);
                        $scope.handleTempChange('c');
                    }

                    $scope.currentScore = angular.extend({colorClass:$scope.getColorClass($scope.edTriagePatient.score.colorCode)}, $scope.edTriagePatient.score);
                    $scope.loading_complete = true;

                    $scope.setFocus('#complaint');


                });
            });

}]).directive('conceptSelectorRow', function () {
    return {
        //restrict: 'E',
        replace:true,
        scope: {
            conceptLabel:"=",
            edTriagePatient: "=",
            concept: "=",
            selectedConcept: "=",
            score:"=",
            scoreLabelClass:"=" ,
            sorter:"=",
            editable:"="
        },
        template: '<tr>' +
            '<td><label>{{conceptLabel}}</label></td>'  +
            '<td colspan="4">' +
            '<concept-select-box ng-show="editable" ed-triage-patient="edTriagePatient" sorter="sorter" concept="concept" ' +
            ' selected-concept="selectedConcept"></concept-select-box>' +
            '<concept-display-box ng-show="!editable" concept="concept" selected-concept="selectedConcept"></concept-display-box>' +
            '</td>' +
            '<td><score-display score="score" score-label-class="scoreLabelClass"></score-display></td></tr>'
        };
}).directive('conceptSelectBox', function () {

    return {
        restrict: 'E',
        scope: {
            edTriagePatient: "=",
            concept: "=",
            selectedConcept: "=",
            inputId:"=",
            sorter:"="
        },
        template: '<select class="form-control" id="{{inputId}}" ng-model="selectedConcept">' +
            '<option value=""></option>' +
        '<option ng-if="a.scope.indexOf(edTriagePatient.patient.ageType) > -1" ng-repeat="a in concept.answers | orderBy:sorter" ng-selected="selectedConcept==a.uuid"  value="{{a.uuid}}">{{a.labelTranslated(edTriagePatient.patient.ageType)}}</option>' +
        '</select>'
    };
}).directive('conceptDisplayBox', function () {

    return {
        restrict: 'E',
        scope: {
            concept: "=",
            selectedConcept: "="
        },
        template: "{{ concept | findAnswer: selectedConcept | property: 'label' }}"
    };
}).directive('scoreDisplay', function () {
    return {
        restrict: 'E',
        replace:true,
        scope: {
            score: "=",
            scoreLabelClass:"="
        },
        template: '<span class="label {{scoreLabelClass}}">{{ score.numericScore ? score.numericScore : "&nbsp;&nbsp;" }}</span>'
    };
}).directive('numberOnlyInput', function () {

    return {
        restrict: 'E',
        replace:true,
        scope: {
            inputValue: '=',
            inputName: '=',
            minValue: '=',
            editableValue: '=',
            maxValue:'='
        },
        template: '<input name="{{inputName}}" ng-model="inputValue" ng-disabled="editableValue" class="form-control" type="number" min="{{minValue}}" max="{{maxValue}}" />',

        link: function(scope) {
            scope.$watch('inputValue', function(newValue, oldValue) {
               var arr = String(newValue).split("");
                if (arr.length === 0) return;
                if (isNaN(newValue)) {
                    scope.inputValue = oldValue;
                }
            });
        }
    };
});