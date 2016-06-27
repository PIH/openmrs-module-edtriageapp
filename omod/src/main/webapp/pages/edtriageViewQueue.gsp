<%
    ui.decorateWith("appui", "standardEmrPage")

    ui.includeJavascript("uicommons", "angular.min.js")
    ui.includeJavascript("uicommons", "angular-ui/ui-bootstrap-tpls-0.13.0.js")
    ui.includeJavascript("uicommons", "angular-ui/angular-ui-router.min.js")
    ui.includeJavascript("uicommons", "ngDialog/ngDialog.min.js")
    ui.includeJavascript("uicommons", "angular-resource.min.js")
    ui.includeJavascript("uicommons", "angular-common.js")
    ui.includeJavascript("uicommons", "angular-app.js")
    ui.includeJavascript("uicommons", "angular-translate.min.js")
    ui.includeJavascript("uicommons", "angular-translate-loader-url.min.js")
    ui.includeJavascript("uicommons", "ngDialog/ngDialog.js")
    ui.includeJavascript("uicommons", "services/conceptService.js")
    ui.includeJavascript("uicommons", "directives/coded-or-free-text-answer.js")

    ui.includeCss("uicommons", "ngDialog/ngDialog.min.css")

    ui.includeJavascript("uicommons", "model/user-model.js")
    ui.includeJavascript("uicommons", "model/encounter-model.js")


    ui.includeCss("edtriageapp", "bootstrap.css")

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
            label: "${ ui.message("edtriageapp.queueLabel") }",
            link: "${ ui.pageLink("edtriageapp", "findPatient?app=" + appId) }"
        }

    ];
</script>

<style>
li{
    margin: 10px 0;
    font-size:12px;
}
</style>


<div class="container" ng-app="edTriageApp" ng-controller="viewQueueController">
    <div class="jumbotron">
        <p>${ ui.message("edtriageapp.queueStatusMessagePrefix") } {{lastUpdatedAtStr}} ${ ui.message("edtriageapp.queueStatusMessageSuffix") }
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

    <div>
        <table class="table">
            <thead>
            <tr>
                <th></th>
                <th>${ ui.message("uicommons.patient") }</th>
                <th>${ ui.message("edtriageapp.waitTime") }</th>
                <th>${ ui.message("edtriageapp.chiefComplaint") }</th>
                <th>${ ui.message("edtriageapp.vitals") } & ${ ui.message("edtriageapp.symptoms") }</th>
                <th></th>
            </tr>
            </thead>
            <tbody>

            <tr ng-repeat="model in edTriagePatientQueue | orderBy: ['-score.numericScore', waitTime()]" >
                <td><span class="label edtriage-label-{{model.getColorHtmlCode()}}" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
                <td>
                    <a ng-href="{{getPatientLink(model.patient.uuid, '${appId}')}}">{{model.patient.display}}
                        <br/>
                        <span class="label label-default">
                            {{model.patient.age}} ${ui.message("uicommons.multipleInputDate.years.label")}
                            <span ng-if="model.patient.gender=='M'">${ui.message("Patient.gender.male")}</span><span ng-if="model.patient.gender=='F'">${ui.message("Patient.gender.female")}</span>
                        </span>
                    </a>
                </td>
                <td>{{model.waitTime(serverTimeDelta)}}</td>
                <td>{{model.chiefComplaint.value}}</td>
                <td>
                    <ul class="list-unstyled">
                        <show-list-item-if-has-value item-value="model.vitals.mobility.value"
                                                     score="getScoreForProp(edTriagePatientConcept.vitals.mobility, model, model.vitals.mobility.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.vitals.mobility, model.vitals.mobility.value).label"
                                                     color="getColorClass(edTriagePatientConcept.vitals.mobility, model, model.vitals.mobility.value)"></show-list-item-if-has-value>

                        <show-if-has-value concept="edTriagePatientConcept" model="model" prop-type-name="'vitals'" prop-value-name="'respiratoryRate'"></show-if-has-value>
                        <show-if-has-value concept="edTriagePatientConcept" model="model" prop-type-name="'vitals'" prop-value-name="'oxygenSaturation'"></show-if-has-value>
                        <show-if-has-value concept="edTriagePatientConcept" model="model" prop-type-name="'vitals'" prop-value-name="'heartRate'"></show-if-has-value>
                        <show-if-has-value concept="edTriagePatientConcept" model="model" prop-type-name="'vitals'" prop-value-name="'temperature'"></show-if-has-value>
                        <show-list-item-if-has-value item-value="model.vitals.consciousness.value"
                                                     score="getScoreForProp(edTriagePatientConcept.vitals.consciousness, model, model.vitals.consciousness.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.vitals.consciousness, model.vitals.consciousness.value).label"
                                                     color="getColorClass(edTriagePatientConcept.vitals.consciousness, model, model.vitals.consciousness.value)"></show-list-item-if-has-value>

                        <show-list-item-if-has-value item-value="model.symptoms.trauma.value"
                                                     score="1"
                                                     item-label="'${ui.message('edtriageapp.trauma')}'"
                                                     color="'score'"></show-list-item-if-has-value>

                        <show-list-item-if-has-value item-value="model.symptoms.neurological.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.neurological, model, model.symptoms.neurological.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.neurological, model.symptoms.neurological.value).label"
                                                     color="getColorClass(edTriagePatientConcept.symptoms.neurological, model, model.symptoms.neurological.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.burn.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.burn, model, model.symptoms.burn.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.burn, model.symptoms.burn.value).label"
                                                     color="getColorClass(edTriagePatientConcept.symptoms.burn, model, model.symptoms.burn.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.trauma.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.trauma, model, model.symptoms.trauma.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.trauma, model.symptoms.trauma.value).label"
                                                     color="getColorClass(edTriagePatientConcept.symptoms.trauma, model, model.symptoms.trauma.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.digestive.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.digestive, model, model.symptoms.digestive.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.digestive, model.symptoms.digestive.value).label"
                                                     color="getColorClass(edTriagePatientConcept.symptoms.digestive, model, model.symptoms.digestive.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.pregnancy.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.pregnancy, model, model.symptoms.pregnancy.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.pregnancy, model.symptoms.pregnancy.value).label"
                                                     color="getColorClass(edTriagePatientConcept.symptoms.pregnancy, model, model.symptoms.pregnancy.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.respiratory.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.respiratory, model, model.symptoms.respiratory.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.respiratory, model.symptoms.respiratory.value).label"
                                                     color="getColorClass(edTriagePatientConcept.symptoms.respiratory, model, model.symptoms.respiratory.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.pain.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.pain, model, model.symptoms.pain.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.pain, model.symptoms.pain.value).label"
                                                     color="getColorClass(edTriagePatientConcept.symptoms.pain, model, model.symptoms.pain.value)"></show-list-item-if-has-value>
                        <show-list-item-if-has-value item-value="model.symptoms.other.value"
                                                     score="getScoreForProp(edTriagePatientConcept.symptoms.other, model, model.symptoms.other.value)"
                                                     item-label="findAnswer(edTriagePatientConcept.symptoms.other, model.symptoms.other.value).label"
                                                     color="getColorClass(edTriagePatientConcept.symptoms.other, model, model.symptoms.other.value)"></show-list-item-if-has-value>
                    </ul>
                </td>
                <td>
                    <button ng-disabled="isSaving" type="button" class="btn btn-xs btn-primary" ng-disabled="isSaving"
                            ng-click="beginConsult(model)">${ ui.message("edtriageapp.beginConsult") }</button>
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
                        <h2>Queue/h2>
                            <pre>{{edTriagePatientQueue | json}}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
    var translations = {
        '12d9f052-6980-4542-91ef-190247811228':'${ui.message("edtriageapp.12d9f052-6980-4542-91ef-190247811228")}',
        '130334AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':'${ui.message("edtriageapp.130334AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")}',
        '139006AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':'${ui.message("edtriageapp.139006AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")}',
        '163476AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':'${ui.message("edtriageapp.163476AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")}',
        '3ccccc20-26fe-102b-80cb-0017a47871b2':'${ui.message("edtriageapp.3ccccc20-26fe-102b-80cb-0017a47871b2")}',
        '3ccd21e8-26fe-102b-80cb-0017a47871b2':'${ui.message("edtriageapp.3ccd21e8-26fe-102b-80cb-0017a47871b2")}',
        '3cce938e-26fe-102b-80cb-0017a47871b2':'${ui.message("edtriageapp.3cce938e-26fe-102b-80cb-0017a47871b2")}',
        '3ceade68-26fe-102b-80cb-0017a47871b2':'${ui.message("edtriageapp.3ceade68-26fe-102b-80cb-0017a47871b2")}',
        '3cf1a95a-26fe-102b-80cb-0017a47871b2':'${ui.message("edtriageapp.3cf1a95a-26fe-102b-80cb-0017a47871b2")}',
        '4bb094a6-c74b-4481-8f81-b98ff8e4cc39':'${ui.message("edtriageapp.4bb094a6-c74b-4481-8f81-b98ff8e4cc39")}',
        '641f4fe3-cac2-46c4-aa94-c8b6d05e9407':'${ui.message("edtriageapp.641f4fe3-cac2-46c4-aa94-c8b6d05e9407")}',
        '7c4d837b-5967-4ba6-902c-ca7651bebf34':'${ui.message("edtriageapp.7c4d837b-5967-4ba6-902c-ca7651bebf34")}',
        'A.163476AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':'${ui.message("edtriageapp.A.163476AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")}',
        'ad52aee5-c789-4442-8dfc-2242375f22e8':'${ui.message("edtriageapp.ad52aee5-c789-4442-8dfc-2242375f22e8")}',
        'eacf7a54-b2fb-4dc1-b2f8-ee0b5926c16c':'${ui.message("edtriageapp.eacf7a54-b2fb-4dc1-b2f8-ee0b5926c16c")}',
        'f4433b74-6396-47ff-aa63-3900493ebf23':'${ui.message("edtriageapp.f4433b74-6396-47ff-aa63-3900493ebf23")}',
        'I.641f4fe3-cac2-46c4-aa94-c8b6d05e9407':'${ui.message("edtriageapp.I.641f4fe3-cac2-46c4-aa94-c8b6d05e9407")}'
    } ;

    angular.module('edTriageApp')
            .value('serverDateTimeInMillis', ${ currentDateTimeInMillis })
            .value('locationUuid', '${ location.uuid }')
            .value('translations', translations);

    jq(function () {
        // make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
        jq(document).on('sessionLocationChanged', function () {
            window.location.reload();
        });
    });
</script>
