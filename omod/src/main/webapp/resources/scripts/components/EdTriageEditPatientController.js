angular.module("edTriagePatientController", [])
    .controller("patientEditController", [ '$scope', '$filter', 'Concepts','PatientService', 'patientUuid', function($scope, $filter, Concepts, PatientService, patientUuid) {
        $scope.foo = "bar";
        //var patientId = patientUuid;
        console.log("$scope.patientUuid=" + patientUuid);
        PatientService.loadConcept().then(function(concept){
            $scope.edTriagePatientConcept = concept;
            PatientService.load(patientUuid).then(function(data){
                //TODO take the default EdTriage concept and apply any values that have been set

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

}]).directive('conceptSelector', function() {
    return {
        restrict: 'E',
        scope: {
            concept:"=",
            selectedConcept: "="
        },

        template: '<div class="form-group row">' +
                    '<label for="{[model.uuid}}" class="col-sm-2 form-control-label">{{concept.label}}</label>'+
                    '<div class="col-sm-10">'+
                    '<select class="form-control" id="{[model.uuid}}" ng-model="selectedConcept">'+
                        '<option ng-repeat="a in concept.answers" ng-selected="selectedConcept==a.uuid"  value="{{a.uuid}}">{{a.label}}</option>'+
                    '</select>'+
                    '</div></div>'
    };
});