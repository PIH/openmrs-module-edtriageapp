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
    ui.includeJavascript("edtriageapp", "components/EdTriagePatientService.js")
    ui.includeJavascript("edtriageapp", "components/EdTriageEditPatientController.js")
    ui.includeJavascript("edtriageapp", "app.js")


%>


<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
    var breadcrumbs = [
        {icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm'},
        {
            label: "${ ui.message("edtriageapp.label") }",
            link: "${ ui.pageLink("edtriageapp", "findPatient?app=" + appId) }"
        }

    ];
</script>


<div class="container" ng-app="edTriageApp" ng-controller="viewQueueController">
    <div class="jumbotron">
        <p>${ ui.message("edtriageapp.queueStatusMessagePrefix") } {{lastUpdatedAtStr}} ${ ui.message("edtriageapp.queueStatusMessageSuffix") }
        <a href="${ui.pageLink("edtriageapp", "findPatient?appId=" + appId)}"
           role="button" class="btn btn-default">${ ui.message("edtriageapp.queueAddNewButton") }</a>                                          </p>
    </div>

    <div>
        <table class="table">
            <thead>
            <tr>
                <th>${ ui.message("uicommons.patient") }</th>
                <th>${ ui.message("edtriageapp.waitTime") }</th>
                <th>${ ui.message("edtriageapp.chiefComplaint") }</th>
                <th>${ ui.message("edtriageapp.vitals") } & ${ ui.message("edtriageapp.symptoms") }</th>
                <th></th>
            </tr>
            </thead>
            <tbody>

            <tr ng-repeat="model in edTriagePatientQueue | orderBy: '-score'">
                <td><span class="label" style="background-color:{{model.getColorHtmlCode()}};">{{model.getColorHtmlCode()}}</span> - <a ng-href="{{getPatientLink(model.patient.uuid, '${appId}')}}">{{model.patient.display}}</a></td>
                <td>{{model.waitTime()}}</td>
                <td>{{model.chiefComplaint.value}}</td>
                <td>
                    <ul>
                        <show-if-has-value-ex concept="edTriagePatientConcept" model="model" prop-type-name="'vitals'" prop-value-name="'respiratoryRate'"></show-if-has-value-ex>
                        <show-if-has-value-ex concept="edTriagePatientConcept" model="model" prop-type-name="'vitals'" prop-value-name="'heartRate'"></show-if-has-value-ex>
                        <show-if-has-value-ex concept="edTriagePatientConcept" model="model" prop-type-name="'vitals'" prop-value-name="'temperature'"></show-if-has-value-ex>
                    </ul>
                </td>
                <td>
                    <button type="button" class="btn btn-xs btn-primary" ng-disabled="isSaving"
                            ng-click="beginConsult()">${ ui.message("edtriageapp.beginConsult") }</button>
                    <button type="button" class="btn btn-xs btn-default" ng-disabled="isSaving"
                            ng-click="removeEdTriage()">${ ui.message("edtriageapp.remove") }</button>

                </td>
            </tr>
            </tbody>
        </table>
    </div>
</div>


<script type="text/javascript">

    angular.module('edTriageApp')
            .value('locationUuid', '${ location.uuid }');

    jq(function () {
        // make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
        jq(document).on('sessionLocationChanged', function () {
            window.location.reload();
        });
    });
</script>
