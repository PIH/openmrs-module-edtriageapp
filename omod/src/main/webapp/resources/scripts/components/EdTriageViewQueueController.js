angular.module("edTriageViewQueueController", [])
    .controller("viewQueueController", ['$scope', '$interval', '$filter', 'PatientService', 'locationUuid',
        function ($scope, $interval, $filter, PatientService, locationUuid) {
            console.log("locationUuid=" + locationUuid);
            // used to determine if we should disable things
            $scope.isSaving = false;
            $scope.lastUpdatedAt = new Date();
            $scope.lastUpdatedAtStr = "";
            $scope.newDate =new Date('2016-06-12T20:45:15.000-0400');

            console.log($scope.newDate);
            //TODO: need to load the list from the web services
            //      and set a timer to reload the data every minute
            console.log("TBD: load the data and set the refresh");

            $scope.loadData = function(){
                $scope.lastUpdatedAt = new Date();
                PatientService.loadConcept().then(function (concept) {
                    $scope.edTriagePatientConcept = concept;
                    PatientService.loadQueue(concept, locationUuid).then(function(edTriagePatientQueue){
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
                    var diff = (new Date().getTime() - $scope.lastUpdatedAt.getTime())/1000;

                    if(diff > 10){
                        //refresh every 60 seconds
                        $scope.loadData();
                    }

                    var minutes = Math.floor(diff / 60);
                    var seconds = Math.floor(diff % 60);
                    if(seconds < 10){
                        seconds = "0" + seconds;
                    }

                    $scope.lastUpdatedAtStr = minutes + ":" + seconds + " seconds";
                }, 1000);
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


        }]);