angular.module("edTriagePatientController", [])
    .controller("patientEditController", ['$scope', '$filter', 'EdTriageDataService', 'EdTriageConcept',
        'patientUuid', 'patientBirthDate', 'patientGender', 'locationUuid',
        function ($scope, $filter, EdTriageDataService, EdTriageConcept, patientUuid, patientBirthDate, patientGender, locationUuid) {
            $scope.loading_complete = false;//used to tell if we when all the data has been loaded
            $scope.isSaving = false; // used to determine if we should disable things

            /* helper function to get the color class for the score
            * @param {String} colorCode - the uuid for the color
             * @return the class suffix
             * */
            $scope.getColorClass = function(colorCode){
                var ret = null;
                if(colorCode == EdTriageConcept.score.red){
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

            /* navigates to the find patient page*/
            $scope.goToFindPatient = function(){
                // go to the add patient page
                if(EdTriageDataService.CONSTANTS.URLS.FIND_PATIENT.length>0){
                    emr.navigateTo({ applicationUrl: (!EdTriageDataService.CONSTANTS.URLS.FIND_PATIENT.startsWith("/") ? '/' : '') + EdTriageDataService.CONSTANTS.URLS.FIND_PATIENT });
                }
            };
            /*
             * the main save function, will return a message in the UI
             * */
            $scope.save = function () {
                $scope.isSaving = true;
                $scope.edTriagePatient.triageQueueStatus.value = EdTriageConcept.status.waitingForEvaluation;
                EdTriageDataService.save($scope.edTriagePatientConcept, $scope.edTriagePatient).then(function (res) {
                    $scope.isSaving = false;
                    if (res.status != 200) {
                        $scope.message = {type: 'danger', text: $filter('json')(res.data)};
                    }
                    else {
                        $scope.message = {
                            type: 'info',
                            text: 'The patient has been added to the queue, the encounter id is ' + res.data.uuid
                        };
                        if(EdTriageDataService.CONSTANTS.URLS.FIND_PATIENT.length>0){
                            emr.navigateTo({ applicationUrl: (!EdTriageDataService.CONSTANTS.URLS.FIND_PATIENT.startsWith("/") ? '/' : '') + EdTriageDataService.CONSTANTS.URLS.FIND_PATIENT });
                        }
                    }
                });
            };

            /*
             * the changes the status of the observation to consult
             * */
            $scope.beginConsult = function () {
                $scope.isSaving = true;

                return EdTriageDataService.beginConsult($scope.edTriagePatientConcept , $scope.edTriagePatient).then(function(res){
                    $scope.isSaving = false;
                    if(res.status != 200){
                        $scope.message = {type: 'danger', text: "The system was not able to update the record"};
                    }
                    else{

                    }
                });

            };


            /*
             * watches the main model for changes and updates the score
             * */
            $scope.$watch('edTriagePatient', function (newValue, oldValue) {
                if ($scope.edTriagePatientConcept != null && newValue != null) {
                    EdTriageDataService.calculate($scope.edTriagePatientConcept, newValue);
                    $scope.currentScore.numericScore = $scope.edTriagePatient.score.numericScore;
                    $scope.currentScore.individualScores = $scope.edTriagePatient.score.individualScores;
                    $scope.currentScore.vitalsScore = $scope.edTriagePatient.score.vitalsScore;
                    $scope.currentScore.colorCode = $scope.edTriagePatient.score.colorCode;
                    $scope.currentScore.colorClass = $scope.getColorClass($scope.currentScore.colorCode);
                }

            }, true);

            /* ---------------------------------------------------------
            *  page initialization code starts here
            * -------------------------------------------------------- */
            //load the data for the page here
            EdTriageDataService.loadConcept().then(function (concept) {
                $scope.edTriagePatientConcept = concept;
                var birthDate = new Date($filter('serverDate')(patientBirthDate));
                EdTriageDataService.load(concept, patientUuid, birthDate, patientGender, locationUuid).then(function (data) {
                    EdTriageDataService.calculate(concept, data);
                    $scope.edTriagePatient = data;
                    $scope.debug = false;
                    $scope.currentScore = angular.extend({colorClass:$scope.getColorClass($scope.edTriagePatient.score.colorCode)}, $scope.edTriagePatient.score);
                    $scope.loading_complete = true;
                    console.log("$scope.edTriagePatient is " + $scope.edTriagePatient);

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
            scoreLabelClass:"="
        },
        template: '<tr>' +
        '<td><label>{{conceptLabel}}</label></td>'  +
        '<td colspan="2"><concept-select-box ed-triage-patient="edTriagePatient" concept="concept" ' +
        ' selected-concept="selectedConcept"></concept-select-box></td>' +
         '<td><score-display ng-if="score" score="score" score-label-class="scoreLabelClass"></score-display></td></tr>'
        };
}).directive('conceptSelectBox', function () {
    return {
        restrict: 'E',

        scope: {
            edTriagePatient: "=",
            concept: "=",
            selectedConcept: "=",
            inputId:"="
        },
        template: '<select class="form-control" id="{{inputId}}" ng-model="selectedConcept">' +
        '<option ng-if="a.scope.indexOf(edTriagePatient.patient.ageType) > -1" ng-repeat="a in concept.answers" ng-selected="selectedConcept==a.uuid"  value="{{a.uuid}}">{{a.label}}</option>' +
        '</select>'
    };
}).directive('scoreDisplay', function () {
    return {
        restrict: 'E',
        replace:true,
        scope: {
            score: "=",
            scoreLabelClass:"="
        },
        template: '<span class="label {{scoreLabelClass}}">{{score}}</span> xx{{labelClass}}yy'
    };
}).directive('scoreDisplayColor', function () {
    return {
        restrict: 'E',
        scope: {
            value: "=",
            age: "=",
            concept:"="
        },
        template: '<pre>{{concept | json}}</pre>'
    };
});