angular.module("edTriagePatientController", [])
    .controller("patientEditController", [ '$scope', '$filter', 'Concepts','PatientService', 'patientUuid', function($scope, $filter, Concepts, PatientService, patientUuid) {
        $scope.foo = "bar";
        //var patientId = patientUuid;
        console.log("$scope.patientUuid=" + patientUuid);
        PatientService.load(patientUuid).then(function(data){
            $scope.edTriagePatient = data;

            $scope.concepts = Concepts;
            $scope.translations = {complaint: $filter('translate')('Chief Complaint'),
                exitButton:'Exit Form / No Triage (ESC)',
                heartRate:'Heartrate',
                mobility:'Mobility',
                oxygenSaturation:'Oxygen Sat.',
                patientInfo: 'Patient Info',
                percent:'%',
                percentComplete:'% Complete',
                perMinute: '/min',
                respiratoryRate:'Respiratory Rate',
                status:'Status',
                submitButton:'Triage Complete (Ctl + Enter)',
                symptoms:'Symptoms',
                unobtainable:'Unobtainable',
                vitals:'Vitals'
            },

            $scope.additionalData = {
                CONSTANTS: PatientService.CONSTANTS,
                debug: true,
                triageColorText: 'Green'
            };
            console.log("$scope.edTriagePatient is " + $scope.edTriagePatient);

           // $scope.$apply($scope.edTriagePatient = data); // <---- Changed

        });


        $scope.canSave = function() {
            return true;
        };

        $scope.save = function(){
            PatientService.save($scope.edTriagePatient);
        };

        $scope.$watch('edTriagePatient', function(newValue, oldValue) {
            //TODO: when a value is updated, update the process and code
            //console.log(oldValue);
            //console.log(newValue);
        }, true);


        $scope.submitForm = function(){
            console.log($scope.edTriagePatient);
        }

}]);