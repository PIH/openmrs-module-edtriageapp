<%
    ui.decorateWith("appui", "standardEmrPage", [ includeBootstrap: false ])

    ui.includeJavascript("uicommons", "angular.min.js")
    ui.includeJavascript("uicommons", "angular-ui/ui-bootstrap-tpls-0.13.0.js")
    ui.includeJavascript("uicommons", "angular-ui/angular-ui-router.min.js")
    ui.includeJavascript("uicommons", "ngDialog/ngDialog.min.js")
    ui.includeJavascript("uicommons", "angular-resource.min.js")
    ui.includeJavascript("uicommons", "angular-common.js")
    ui.includeJavascript("uicommons", "angular-app.js")
    ui.includeJavascript("uicommons", "angular-translate.min.js")
    ui.includeJavascript("uicommons", "angular-translate-loader-url.min.js")
    ui.includeJavascript("uicommons", "services/conceptService.js")
    ui.includeJavascript("uicommons", "directives/coded-or-free-text-answer.js")
    ui.includeJavascript("uicommons", "services/session.js")

    ui.includeCss("uicommons", "ngDialog/ngDialog.min.css")

    ui.includeJavascript("uicommons", "model/user-model.js")
    ui.includeJavascript("uicommons", "model/encounter-model.js")

    ui.includeCss("edtriageapp", "bootstrap.css")
    ui.includeCss("edtriageapp", "edtriageapp.css")

    ui.includeJavascript("edtriageapp", "filters.js")
    ui.includeJavascript("edtriageapp", "components/EdTriageViewQueueController.js")
    ui.includeJavascript("edtriageapp", "components/EdTriagePatientFactory.js")
    ui.includeJavascript("edtriageapp", "components/EdTriageConceptFactory.js")
    ui.includeJavascript("edtriageapp", "components/EdTriageDataService.js")
    ui.includeJavascript("edtriageapp", "components/EdTriageEditPatientController.js")
    ui.includeJavascript("edtriageapp", "app.js")


%>

<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
    var breadcrumbs = [
        {icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm'},
        {
            label: "${ ui.message("edtriageapp.queueLabel") }", link: "${ ui.pageLink("edtriageapp", "edtriageViewQueue?appId=edtriageapp.app.triageQueue") }"
        }

    ];
</script>

<style>
.blink_me {
    background-color: red;
    animation-name: example;
    animation-duration: 1s;
    animation-direction: alternate;
    animation-timing-function: ease-out;
    animation-iteration-count: infinite;
}
/* Standard syntax */
@keyframes example {
    from {background-color: red;}
    to {background-color: white;}
}

</style>


<div class="container" ng-app="edTriageApp" ng-controller="viewQueueController">
    <div class="jumbotron">
        <p>
            <span>${ ui.message("edtriageapp.queueStatusMessagePrefix") } {{lastUpdatedAtStr}} ${ ui.message("edtriageapp.queueStatusMessageSuffix") }</span>
            <br>
            <span> ${ ui.message("edtriageapp.patients") }:</span>
            <span class="label edtriage-label-blue" >{{ colorScores[colorIndex.blue] }} ${ ui.message("edtriageapp.blue") }&nbsp;&nbsp;</span>
            <span class="label edtriage-label-red" >{{ colorScores[colorIndex.red] }} ${ ui.message("edtriageapp.red") }&nbsp;&nbsp;</span>
            <span class="label edtriage-label-orange" >{{ colorScores[colorIndex.orange] }} ${ ui.message("edtriageapp.orange") }&nbsp;&nbsp;</span>
            <span class="label edtriage-label-yellow" >{{ colorScores[colorIndex.yellow] }} ${ ui.message("edtriageapp.yellow") }&nbsp;&nbsp;</span>
            <span class="label edtriage-label-green" >{{ colorScores[colorIndex.green] }} ${ ui.message("edtriageapp.green") }&nbsp;&nbsp;</span>

        <a ng-if="debug" href="${ui.pageLink("edtriageapp", "findPatient?appId=" + appId)}"
           role="button" class="btn btn-default">${ ui.message("edtriageapp.queueAddNewButton") }</a>
        </p>

    </div>

    <div class="alert alert-{{message.type}} alert-dismissible fade in" role="alert" ng-show="message.text.length > 0">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        {{message.text}}
    </div>


    <div class="input-group"> <span class="input-group-addon">${ui.message("edtriageapp.filter")}</span>
        <input id="filter" type="text" class="form-control" placeholder="" ng-model="patientFilter">
    </div>
    <br/>

    <div>
        <table class="table">
            <thead>
            <tr>
                <th></th>
                <th>${ ui.message("uicommons.patient") }</th>
                <th>${ ui.message("edtriageapp.waitTime") }</th>
                <th>${ ui.message("edtriageapp.chiefComplaint") }</th>
                <th class="vitals-and-symptoms-column">${ ui.message("edtriageapp.vitals") } & ${ ui.message("edtriageapp.symptoms") }</th>
                <th>${ ui.message("edtriageapp.clinicalImpression") }</th>
                <th>${ ui.message("edtriageapp.testAndTreatments") } </th>
                <th></th>
            </tr>
            </thead>
            <tbody>

            <tr ng-repeat="model in edTriagePatientQueue | orderBy: [ 'getColorWeight()', '-waitTime()' ] | filter:patientFilter" >
                <td><span class="label edtriage-label-{{model.getColorHtmlCode()}}" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
                <td>
                    <a ng-href="{{getPatientLink(model.patient.uuid, '${appId}', '${ ui.message("edtriageapp.queueLabel") }')}}">{{model.patient.display}}
                        <br/>
                        <span class="label edtriage-label-{{model.patient.lessThan4WeeksOld?'red':'score'}}">
                            {{model.patient.lessThan4WeeksOld ? "${ ui.message('edtriageapp.lessThan4WeeksOld') }":model.patient.age + "${ui.message('uicommons.multipleInputDate.years.label')}"}}
                            <span ng-if="model.patient.gender=='M'">${ui.message("Patient.gender.male")}</span><span ng-if="model.patient.gender=='F'">${ui.message("Patient.gender.female")}</span>
                        </span>
                    </a>
                </td>
                <td><span ng-class="isBlinkable(model.waitTime(serverTimeDelta), model.getColorHtmlCode()) ? 'blink_me' : '' " >{{model.waitTimeFormatted(serverTimeDelta)}}</span></td>
                <td>{{model.chiefComplaint.value | limitTo:140 }}{{model.chiefComplaint.value.length > 140 ? '...' : ''}}</td>
                <td>
                    <ul class="list-unstyled">
                        <show-list-item-if-has-value item-value="model.vitals.mobility.value"
                                                     score="getScoreForProp(edTriagePatientConcept.vitals.mobility, model, model.vitals.mobility.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.vitals.mobility, model.vitals.mobility.value).labelTranslated(model.patient.ageType)"
                                                     color="getColorClassFromScore(model.patient.uuid, model.vitals.mobility.value)"></show-list-item-if-has-value>

                        <show-if-has-value item-value="model.vitals.respiratoryRate.value"
                                                     score="getScore(model.patient.uuid, edTriagePatientConcept.vitals.respiratoryRate.uuid)"
                                                     item-label="edTriagePatientConcept.vitals.respiratoryRate.labelTranslated(model.patient.ageType)"
                                                     color="'score'"></show-if-has-value>

                        <show-if-has-value item-value="model.vitals.oxygenSaturation.value"
                                           score="getScore(model.patient.uuid, edTriagePatientConcept.vitals.oxygenSaturation.uuid)"
                                           item-label="edTriagePatientConcept.vitals.oxygenSaturation.labelTranslated(model.patient.ageType)"
                                           color="getColorClassFromScore(model.patient.uuid, edTriagePatientConcept.vitals.oxygenSaturation.uuid)"></show-if-has-value>

                        <show-if-has-value item-value="model.vitals.heartRate.value"
                                           score="getScore(model.patient.uuid, edTriagePatientConcept.vitals.heartRate.uuid)"
                                           item-label="edTriagePatientConcept.vitals.heartRate.labelTranslated(model.patient.ageType)"
                                           color="getColorClassFromScore(model.patient.uuid, edTriagePatientConcept.vitals.heartRate.uuid)"></show-if-has-value>

                        <show-if-has-value item-value="(model.vitals.systolicBloodPressure.value) ? (model.vitals.systolicBloodPressure.value + '/' + model.vitals.diastolicBloodPressure.value) : ''"
                                           score="getScore(model.patient.uuid, edTriagePatientConcept.vitals.systolicBloodPressure.uuid)"
                                           item-label="'${ui.message("edtriageapp.bloodPressure")}'"
                                           color="getColorClassFromScore(model.patient.uuid, edTriagePatientConcept.vitals.systolicBloodPressure.uuid)"></show-if-has-value>

                        <show-if-has-value item-value="model.vitals.temperature.value"
                                           score="getScore(model.patient.uuid, edTriagePatientConcept.vitals.temperature.uuid)"
                                           item-label="edTriagePatientConcept.vitals.temperature.labelTranslated(model.patient.ageType)"
                                           color="getColorClassFromScore(model.patient.uuid, edTriagePatientConcept.vitals.temperature.uuid)"></show-if-has-value>


                        <show-list-item-if-has-value item-value="model.vitals.consciousness.value"
                                                     score="getScoreForProp(edTriagePatientConcept.vitals.consciousness, model, model.vitals.consciousness.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.vitals.consciousness, model.vitals.consciousness.value).labelTranslated(model.patient.ageType)"
                                                     color="getColorClassFromScore(model.patient.uuid, model.vitals.consciousness.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.vitals.trauma.value"
                                                     score="getScoreForProp(edTriagePatientConcept.vitals.trauma, model, model.vitals.trauma.value)"
                                                     item-label="'${ui.message('edtriageapp.trauma')}'"
                                                     color="'score'"></show-list-item-if-has-value>

                        <show-list-item-if-has-value item-value="model.symptoms.emergencySigns.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.emergencySigns, model, model.symptoms.emergencySigns.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.emergencySigns, model.symptoms.emergencySigns.value).labelTranslated(model.patient.ageType)"
                                                     color="getColorClassFromScore(model.patient.uuid, model.symptoms.emergencySigns.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.neurological.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.neurological, model, model.symptoms.neurological.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.neurological, model.symptoms.neurological.value).labelTranslated(model.patient.ageType)"
                                                     color="getColorClassFromScore(model.patient.uuid, model.symptoms.neurological.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.burn.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.burn, model, model.symptoms.burn.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.burn, model.symptoms.burn.value).labelTranslated(model.patient.ageType)"
                                                     color="getColorClassFromScore(model.patient.uuid, model.symptoms.burn.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.diabetic.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.diabetic, model, model.symptoms.diabetic.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.diabetic, model.symptoms.diabetic.value).labelTranslated(model.patient.ageType)"
                                                     color="getColorClassFromScore(model.patient.uuid, model.symptoms.diabetic.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.trauma.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.trauma, model, model.symptoms.trauma.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.trauma, model.symptoms.trauma.value).labelTranslated(model.patient.ageType)"
                                                     color="getColorClassFromScore(model.patient.uuid, model.symptoms.trauma.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.digestive.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.digestive, model, model.symptoms.digestive.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.digestive, model.symptoms.digestive.value).labelTranslated(model.patient.ageType)"
                                                     color="getColorClassFromScore(model.patient.uuid, model.symptoms.digestive.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.pregnancy.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.pregnancy, model, model.symptoms.pregnancy.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.pregnancy, model.symptoms.pregnancy.value).labelTranslated(model.patient.ageType)"
                                                     color="getColorClassFromScore(model.patient.uuid, model.symptoms.pregnancy.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.respiratory.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.respiratory, model, model.symptoms.respiratory.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.respiratory, model.symptoms.respiratory.value).labelTranslated(model.patient.ageType)"
                                                     color="getColorClassFromScore(model.patient.uuid, model.symptoms.respiratory.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.pain.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.pain, model, model.symptoms.pain.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.pain, model.symptoms.pain.value).labelTranslated(model.patient.ageType)"
                                                     color="getColorClassFromScore(model.patient.uuid, model.symptoms.pain.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.other.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.other, model, model.symptoms.other.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.other, model.symptoms.other.value).labelTranslated(model.patient.ageType)"
                                                     color="getColorClassFromScore(model.patient.uuid,model.symptoms.other.value)"></show-list-item-if-has-value>
                    </ul>
                </td>
                <td>{{model.clinicalImpression.value | limitTo:140 }}{{model.clinicalImpression.value.length > 140 ? '...' : ''}}</td>
                <td>
                    <ul class="list-unstyled">
                        <show-if-has-value item-value="model.labs.glucose.value"
                                           score="getScore(model.patient.uuid, edTriagePatientConcept.labs.glucose.uuid)"
                                           item-label="'${ui.message("edtriageapp.labs.glucose")}'"
                                           color="getColorClassFromScore(model.patient.uuid, edTriagePatientConcept.labs.glucose.uuid)">
                        </show-if-has-value>
                        <li class="edtriage-queue-list-item" ng-if="model.labs.pregnancy_test.value">
                            {{ '${ui.message("edtriageapp.labs.pregnancyTest")}' + ': ' + findAnswer(edTriagePatientConcept.labs.pregnancy_test, model.labs.pregnancy_test.value).labelTranslated(model.patient.ageType)}}
                        </li>
                        <li class="edtriage-queue-list-item" ng-if="model.treatment.paracetamol.value">
                            ${ui.message("edtriageapp.paracetamol")}
                            <span ng-if="model.treatment.paracetamolDose.value">{{model.treatment.paracetamolDose.value}}<small>mg</small></span>
                        </li>
                        <li class="edtriage-queue-list-item" ng-if="model.treatment.oxygen.value">
                            ${ui.message("edtriageapp.oxygen")}
                        </li>
                    </ul>
                </td>

                <td class="edtriage-queue-button-column">
                    <button ng-disabled="isSaving" type="button" class="btn btn-xs btn-primary edtriage-queue-button" ng-disabled="isSaving"
                            ng-click="beginConsult(model)">${ ui.message("edtriageapp.beginConsult") }</button>
                    <button ng-disabled="isSaving" type="button" class="btn btn-xs btn-default" ng-disabled="isSaving"
                            ng-click="leftEdTriage(model)">${ ui.message("edtriageapp.leftWithoutBeingSeen") }</button>
                    <button ng-disabled="isSaving" type="button" class="btn btn-xs btn-default" ng-disabled="isSaving"
                            ng-click="removeEdTriage(model)">${ ui.message("edtriageapp.remove") }</button>

                </td>
            </tr>
            </tbody>
        </table>
    </div>

    <div ng-if="debug">
        <br/><br/><br/>
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3 class="panel-title">Debug Info</h3>
            </div>
            <div class="panel-body">
                <div class="col-sm-11">
                    <div>
                        <h2>Queue</h2>
                            <pre>{{edTriagePatientQueue | json}}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

${ ui.includeFragment("edtriageapp", "translations") }

<script type="text/javascript">
    angular.module('edTriageApp')
            .value('patientDashboard', '${ dashboardUrl }')
            .value('serverDateTimeInMillis', ${ currentDateTimeInMillis })
            .value('locationUuid', '${ location.uuid }')
            .value('translations', translations)
            .value('config', '${ edtriageConfig }');

    jq(function () {
        // make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
        jq(document).on('sessionLocationChanged', function () {
            window.location.reload();
        });
    });
</script>
