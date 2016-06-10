angular.module("edTriagePatientController", [])
    .controller("patientEditController", ['$scope', '$filter', 'PatientService', 'patientUuid', 'patientBirthDate', 'patientGender',  'locationUuid',
        function ($scope, $filter, PatientService, patientUuid, patientBirthDate, patientGender,locationUuid) {
            $scope.foo = "bar";
            //var patientId = patientUuid;
            console.log("patientUuid=" + patientUuid);
            console.log("patientBirthDate=" + patientBirthDate);
            console.log("patientGender=" + patientGender);
            console.log("locationUuid=" + locationUuid);
            PatientService.loadConcept().then(function (concept) {
                $scope.edTriagePatientConcept = concept;
                PatientService.load(concept, patientUuid, patientBirthDate, patientGender, locationUuid).then(function (data) {
                    PatientService.calculate(concept, data);
                    $scope.edTriagePatient = data;
                    $scope.edTriageConcept = concept;
                    $scope.translations = {
                        complaint: $filter('translate')('Chief Complaint'),
                        exitButton: 'Exit Form / No Triage (ESC)',
                        heartRate: 'Heartrate',
                        mobility: 'Mobility',
                        oxygenSaturation: 'Oxygen Sat.',
                        patientInfo: 'Patient Info',
                        percent: '%',
                        percentComplete: '% Complete',
                        perMinute: '/min',
                        respiratoryRate: 'Respiratory Rate',
                        status: 'Status',
                        submitButton: 'Triage Complete (Ctl + Enter)',
                        symptoms: 'Symptoms',
                        unobtainable: 'Unobtainable',
                        vitals: 'Vitals'
                    };

                    $scope.additionalData = {
                        CONSTANTS: PatientService.CONSTANTS,
                        debug: true,
                    };

                    $scope.currentScore = angular.extend({}, $scope.edTriagePatient.score);
                    console.log("$scope.edTriagePatient is " + $scope.edTriagePatient);

                });
            });


            $scope.canSave = function () {
                return true;
            };

            $scope.save = function () {
                PatientService.save($scope.edTriageConcept, $scope.edTriagePatient).then(function (res) {
                    if (res.status != 200) {
                        $scope.message = {type: 'danger', text: $filter('json')(res.data)};
                    }
                    else {
                        $scope.message = {type: 'info', text: 'The patient has been added to the queue, the encounter id is ' + res.data.uuid};
                    }
                });
            };

            $scope.$watch('edTriagePatient', function (newValue, oldValue) {
                if($scope.edTriageConcept != null && newValue != null) {
                    PatientService.calculate($scope.edTriageConcept, newValue);
                    $scope.currentScore.overall = $scope.edTriagePatient.score.overall;
                }

            }, true);


            $scope.submitForm = function () {
                console.log($scope.edTriagePatient);
            }

        }]).directive('conceptSelector', function () {
    return {
        restrict: 'E',
        scope: {
            concept: "=",
            selectedConcept: "="
        },

        template: '<div class="form-group row">' +
        '<label for="{[model.uuid}}" class="col-sm-2 form-control-label">{{concept.label}}</label>' +
        '<div class="col-sm-10">' +
        '<select class="form-control" id="{[model.uuid}}" ng-model="selectedConcept">' +
        '<option ng-repeat="a in concept.answers" ng-selected="selectedConcept==a.uuid"  value="{{a.uuid}}">{{a.label}}</option>' +
        '</select>' +
        '</div></div>'
    };
});