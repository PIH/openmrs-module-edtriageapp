angular.module("edTriagePatientController", [])
    .controller("patientEditController", ['$scope', '$filter', 'EdTriageDataService', 'EdTriageConcept',
        'patientUuid', 'patientBirthDate', 'patientGender', 'locationUuid',
        function ($scope, $filter, EdTriageDataService, EdTriageConcept, patientUuid, patientBirthDate, patientGender, locationUuid) {
            EdTriageDataService.loadConcept().then(function (concept) {
                $scope.edTriagePatientConcept = concept;
                var birthDate = new Date($filter('serverDate')(patientBirthDate));
                EdTriageDataService.load(concept, patientUuid, birthDate, patientGender, locationUuid).then(function (data) {
                    EdTriageDataService.calculate(concept, data);
                    $scope.edTriagePatient = data;
                    $scope.edTriageConcept = concept;
                    $scope.debug = false;
                    $scope.currentScore = angular.extend({colorClass:getColorClass($scope.edTriagePatient.score.colorCode)}, $scope.edTriagePatient.score);
                    console.log("$scope.edTriagePatient is " + $scope.edTriagePatient);

                });
            });

            // used to determine if we should disable things
            $scope.isSaving = false;

            /*
             * the main save function, will return a message in the UI
             * */
            $scope.save = function () {
                $scope.isSaving = true;
                EdTriageDataService.save($scope.edTriageConcept, $scope.edTriagePatient).then(function (res) {
                    $scope.isSaving = false;
                    if (res.status != 200) {
                        $scope.message = {type: 'danger', text: $filter('json')(res.data)};
                    }
                    else {
                        $scope.message = {
                            type: 'info',
                            text: 'The patient has been added to the queue, the encounter id is ' + res.data.uuid
                        };
                        var url = "coreapps/findpatient/findPatient.page?app=edtriageapp.app.edTriage";
                        emr.navigateTo({ applicationUrl: (!url.startsWith("/") ? '/' : '') + url });
                    }
                });
            };
            /*
             * watches the main model for changes and updates the score
             * */
            $scope.$watch('edTriagePatient', function (newValue, oldValue) {
                if ($scope.edTriageConcept != null && newValue != null) {
                    EdTriageDataService.calculate($scope.edTriageConcept, newValue);
                    $scope.currentScore.numericScore = $scope.edTriagePatient.score.numericScore;
                    $scope.currentScore.colorCode = $scope.edTriagePatient.score.colorCode;
                    $scope.currentScore.colorClass = getColorClass($scope.currentScore.colorCode);
                }

            }, true);

            function getColorClass(colorCode){
                var ret = 'green';
                if(colorCode == EdTriageConcept.score.red){
                    ret = "red";
                }
                else if(colorCode == EdTriageConcept.score.orange){
                    ret = "orange";
                }
                else if(colorCode == EdTriageConcept.score.yellow){
                    ret = "yellow";
                }
                else{
                    ret = "green";
                }
                return ret;
            }


        }]).directive('conceptSelector', function () {
    return {
        restrict: 'E',
        scope: {
            edTriagePatient: "=",
            concept: "=",
            selectedConcept: "=",
            inputId:"="
        },
        template: '<div class="form-group row">' +
        '<label for="{{inputId}}" class="col-sm-4 form-control-label">{{concept.label}}</label>' +
        '<div class="col-sm-8">' +
        '<select class="form-control" id="{{inputId}}" ng-model="selectedConcept">' +
        '<option ng-if="a.scope.indexOf(edTriagePatient.patient.ageType) > -1" ng-repeat="a in concept.answers" ng-selected="selectedConcept==a.uuid"  value="{{a.uuid}}">{{a.label}}</option>' +
        '</select>' +
        '</div></div>'
    };
});