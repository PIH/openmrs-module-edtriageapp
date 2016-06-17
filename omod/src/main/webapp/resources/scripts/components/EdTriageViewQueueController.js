angular.module("edTriageViewQueueController", [])
    .controller("viewQueueController", ['$scope', '$interval', '$filter', 'EdTriageDataService', 'EdTriageConcept', 'locationUuid', 'serverDateTimeInMillis',
        function ($scope, $interval, $filter, EdTriageDataService, EdTriageConcept, locationUuid, serverDateTimeInMillis) {
            console.log("locationUuid=" + locationUuid);
            // used to determine if we should disable things
            $scope.isSaving = false;
            $scope.lastUpdatedAtInMillis = new Date().getTime();
            $scope.serverTimeDelta = $scope.lastUpdatedAtInMillis - serverDateTimeInMillis;
            $scope.lastUpdatedAtStr = "2:00 ";

            $scope.loadData = function(){
                $scope.lastUpdatedAtInMillis = new Date().getTime();
                EdTriageDataService.loadConcept().then(function (concept) {
                    $scope.edTriagePatientConcept = concept;
                    EdTriageDataService.loadQueue(concept, locationUuid).then(function(edTriagePatientQueue){
                        $scope.edTriagePatientQueue = edTriagePatientQueue.data;
                    });
                });
            };
            $scope.loadData();

            /*
             * the changes the status of the observation to consult
             * */
            $scope.beginConsult = function () {
                $scope.isSaving = true;
                console.log("TBD: implement " + beginConsult);
                $scope.isSaving = false;
            };

            /* builds a link to the patient edit page*/
            $scope.getPatientLink = function(uuid, appId){
                return "edtriageEditPatient.page?patientId=" + uuid + "&appId=" + appId;
            };

            $scope.listofVitalsAsLabelsAndValues = function(edTriagePatient){
                var ret = [];
                if(edTriagePatient.vitals.respiratoryRate != null){
                    ret.push({label: $scope.edTriagePatientConcept.vitals.respiratoryRate.label , value:edTriagePatient.vitals.respiratoryRate.value});
                }
                if(edTriagePatient.vitals.heartRate != null){
                    ret.push({label: $scope.edTriagePatientConcept.vitals.respiratoryRate.label , value:edTriagePatient.vitals.respiratoryRate.value});
                }


                return ret;
            };

            $scope.getColorClass = function(edTriagePatient){
                var ret = "label-success";
                var colorCode = edTriagePatient.score.colorCode.value;
                if(colorCode == EdTriageConcept.score.red){
                    ret = "label-danger";
                }
                else if(colorCode == EdTriageConcept.score.orange){
                    ret = "label-warning";
                }
                else if(colorCode == EdTriageConcept.score.yellow){
                    ret = "label-info";
                }
                else{
                    ret = "label-success";
                }
                return ret;
            } ;
            
            /*
             * the changes the status of the observation to consult
             * */
            $scope.removeConsult = function () {
                $scope.isSaving = true;
                console.log("TBD: implement " + removeConsult);
                $scope.isSaving = false;
            };

            var stopTimeUpdates;
            $scope.startUpdateTime = function() {

                // Don't start a new fight if we are already fighting
                if ( angular.isDefined(stopTimeUpdates) ) return;

                stopTimeUpdates = $interval(function() {
                    var refreshInterval = 120;
                    //$scope.serverTimeDelta = $scope.lastUpdatedAtInMillis - serverDateTimeInMillis;
                    
                    
                    var diff = refreshInterval - ((new Date().getTime()) - $scope.lastUpdatedAtInMillis)/1000;

                    if(diff <= 0){
                        //refresh every 2 minutes
                        $scope.loadData();
                        return;
                    }

                    var minutes = Math.floor(diff / 60);
                    var seconds = Math.floor(diff % 60);
                    if(seconds < 10){
                        seconds = "0" + seconds;
                    }

                    $scope.lastUpdatedAtStr = minutes + ":" + seconds;
                }, 10000);
            };

            $scope.startUpdateTime();


            $scope.stopUpdateTime = function() {
                if (angular.isDefined(stopTimeUpdates)) {
                    $interval.cancel(stopTimeUpdates);
                    stopTimeUpdates = undefined;
                }
            };

            $scope.$on('$destroy', function() {
                // Make sure that the interval is destroyed too
                $scope.stopUpdateTime();
            });


        }]).directive('showIfHasValue', function () {
        //&& concept[propTypeName][propValueName].score(model.patient.ageType,model[propTypeName][propValueName].value)>
        return {
            restrict: 'E',
            scope: {
                concept: "=",
                model: "=",
                propTypeName:"=",
                propValueName: "="
            },
            template:
                "<li ng-if='model[propTypeName][propValueName].value'>{{concept[propTypeName][propValueName].label}}: {{model[propTypeName][propValueName].value}}</li>"
        };
    });