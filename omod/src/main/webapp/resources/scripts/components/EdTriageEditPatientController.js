angular.module("edTriagePatientController", [])
    .controller("patientEditController", [ '$scope', 'PatientService', function($scope, PatientService) {
        $scope.foo = "bar";
        var patientId = 1;
        PatientService.load(patientId).then(function(data){
            $scope.edTriagePatient = data;
            $scope.additionalData = {
                CONSTANTS: PatientService.CONSTANTS,
                debug: false,
                language: {complaint: 'Chief Complaint',
                    exitButton:'Exit Form / No Triage (ESC)',
                    heartRate:'Heartrate',
                    mobility:'Mobility',
                    oxygenSaturation:'Oxygen Sat.',
                    patientInfo: 'Patient Info',
                    percent:'%',
                    percentComplete:'% Complete',
                    perMinute: '%/min',
                    respiratoryRate:'Respiratory Rate',
                    status:'Status',
                    submitButton:'Triage Complete (Ctl + Enter)',
                    symptoms:'Symptoms',
                    unobtainable:'Unobtainable',
                    vitals:'Vitals'
                },
                patientTypeAsString: PatientService.getPatientTypeAsString($scope.edTriagePatient),
                triageColorText: 'Green'
            };
            console.log("$scope.edTriagePatient is " + $scope.edTriagePatient);
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

// // var myApp2 =  angular.module('myApp2',[]);
// //
// app.controller('GreetingController', ['$scope', function($scope) {
//     $scope.greeting = 'Hola!';
// }]);