angular.module("edTriageViewQueueController", [])
    .controller("viewQueueController", ['$scope', '$interval', '$filter', 'EdTriageDataService', 'EdTriageConcept', 'locationUuid',
        'serverDateTimeInMillis','patientDashboard',"ngDialog",
        function ($scope, $interval, $filter, EdTriageDataService, EdTriageConcept, locationUuid, serverDateTimeInMillis, patientDashboard, ngDialog) {
            // used to determine if we should disable things
            $scope.isSaving = false;
            $scope.lastUpdatedAtInMillis = new Date().getTime();
            $scope.patientDashboard = patientDashboard;
            $scope.serverTimeDelta = $scope.lastUpdatedAtInMillis - serverDateTimeInMillis;
            $scope.lastUpdatedAtStr = "2:00 ";
            $scope.triageStatusCodes =  EdTriageConcept.status;
            $scope.debug = false;
            $scope.dataRefreshIntervalInSeconds = 120;
            $scope.timerRefreshIntervalInSeconds = 10;
            $scope.scores = [];
            $scope.patientFilter = null; //used to filter the list
            /*  loads the patient list
             * */
            $scope.loadPatientData = function(){
                $scope.lastUpdatedAtInMillis = new Date().getTime();
                return EdTriageDataService.loadQueue($scope.edTriagePatientConcept, locationUuid).then(function(edTriagePatientQueue){
                    // TODO can this go?
                    //iterate through the list and save the scores, so that we can use them without having to
                    //recalculate them later
                    for(var i=0;i<edTriagePatientQueue.data.length;++i){
                        var p = edTriagePatientQueue.data[i];
                        var score = EdTriageDataService.calculate($scope.edTriagePatientConcept, p);
                        $scope.scores[p.patient.uuid] = score;

                    }
                    $scope.edTriagePatientQueue = edTriagePatientQueue.data;
                });
            };
            /*
            loads all the data
             */
            $scope.loadData = function(){
                $scope.lastUpdatedAtInMillis = new Date().getTime();
                return EdTriageDataService.loadConcept().then(function (concept) {
                    $scope.edTriagePatientConcept = concept;
                    return $scope.loadPatientData(locationUuid).then(function(edTriagePatientQueue){});
                });
            };


            /*
             * the changes the status of the observation to consult
             * */
            $scope.beginConsult = function (edTriagePatient) {

                ngDialog.openConfirm({
                    showClose: true,
                    closeByEscape: true,
                    template: "edtriageConfirmBeginConsult.page"
                }).then(function() {

                    $scope.isSaving = true;

                    return EdTriageDataService.beginConsult($scope.edTriagePatientConcept , edTriagePatient).then(function(res){
                        $scope.isSaving = false;
                        if(res.status != 200){
                            alert("The system was not able to update the record");
                            $scope.message = {type: 'danger', text: $filter('json')(res.data)};
                        }
                        else{
                            //just reload the data, there might be new ones in the queue
                            //return $scope.loadPatientData();
                            var url = $scope.patientDashboard.replace("{{patientId}}", edTriagePatient.patient.uuid);
                            emr.navigateTo({ applicationUrl: url});

                        }
                    });
                })
            };

            /*
             * the changes the status of the observation to consult
             * */
            $scope.removeEdTriage = function (edTriagePatient) {

                ngDialog.openConfirm({
                    showClose: true,
                    closeByEscape: true,
                    template: "edtriageConfirmRemoveFromQueue.page"
                }).then(function() {

                    $scope.isSaving = true;

                    return EdTriageDataService.removeConsult($scope.edTriagePatientConcept, edTriagePatient).then(function (res) {
                        $scope.isSaving = false;
                        if (res.status != 200) {
                            alert("The system was not able to remove the record");
                            $scope.message = {type: 'danger', text: $filter('json')(res.data)};
                        }
                        else {
                            //just reload the data, there might be new ones in the queue
                            return $scope.loadPatientData();
                        }

                    });
                });
            };


            /* builds a link to the patient edit page*/
            $scope.getPatientLink = function(uuid, appId, returnLabel){
                return "edtriageEditPatient.page?patientId=" + uuid
                    + "&appId=" + appId
                    + "&returnUrl=/" + OPENMRS_CONTEXT_PATH + window.encodeURIComponent("/edtriageapp/edtriageViewQueue.page?appId=edtriageapp.app.triageQueue")
                    + "&returnLabel=" + window.encodeURIComponent(returnLabel);
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

            /* helper function to get the color class for the score
             * @param {String} colorCode - the uuid for the color
             * @return the class suffix
             * */
            $scope.getColorClassFromScore = function(patientUuid, answerUuid){
                var color;
                var score = $scope.getScore(patientUuid, answerUuid);
                if (score) {
                    color = EdTriageDataService.getColorClass(score.colorCode);
                }
                if(color == null){
                    //this means we didn't have a color, it's some kind of numeric score,
                    //so just use the default val
                    color = 'score';
                }
                return color;
            };

            $scope.getScore = function(patientUuid, answerUuid){
                if($scope.scores !== undefined && patientUuid &&  answerUuid){
                     return $scope.scores[patientUuid].individualScores[answerUuid];
                }

            }
            $scope.getScoreForProp = function(concept, edTriagePatient, uuid){
                if(uuid == null){
                    return -1;
                }
                var answer = $scope.findAnswer(concept, uuid);
                var score = $scope.getScore(edTriagePatient.patient.uuid, answer.uuid);
                return score;

            } ;

            /* helper function for finding an answer for a question in the concept def
            * @param {EdTriageConcept} concept - the concepts
            * @param {String} uuid - the answer UUID
            * @return the answer object
            * */
            $scope.findAnswer = function(concept, uuid){
                return $filter('findAnswer')(concept, uuid);
            };

            /* the timer to refresh updates*/
            var stopTimeUpdates;
            $scope.startUpdateTime = function() {

                // Don't start a new fight if we are already fighting
                if ( angular.isDefined(stopTimeUpdates) ) return;

                stopTimeUpdates = $interval(function() {
                    var refreshInterval = $scope.dataRefreshIntervalInSeconds;
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
                }, $scope.timerRefreshIntervalInSeconds*1000);
            };

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

            /* ---------------------------------------------------------
             *  page initialization code starts here
             * -------------------------------------------------------- */
            $scope.loadData();
            $scope.startUpdateTime();


        }]).directive('showIfHasValue', function () {
        return {
            restrict: 'E',
            scope: {
                itemValue: "=",
                itemLabel: "=",
                color:"=",
                score: "="
            },
            template:
                "<li class='edtriage-queue-list-item' ng-if='itemValue && (score > 0 || score.length > 0)'>" +
                "<span class='label edtriage-label-{{color}}'><span ng-if='score*1==score'>{{score}}</span><span ng-if='score*1!=score'>&nbsp;&nbsp;</span></span>" +
                "&nbsp;{{itemLabel}}: {{itemValue}}</li>"
        };
    }).directive('showListItemIfHasValue', function () {
    return {
        restrict: 'E',
        scope: {
            itemValue: "=",
            itemLabel:"=",
            color: "=",
            score:"="
        },
        template:
            "<li  class='edtriage-queue-list-item' ng-if='itemValue && score != 0'><span class='label edtriage-label-{{color}}'><span ng-if='score*1==score'>{{score}}</span><span ng-if='score*1!=score'>&nbsp;&nbsp;</span></span>&nbsp;{{itemLabel}}</li>"
    };
});