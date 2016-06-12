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


	ui.includeCss("edtriageapp", "bootstrap/dist/css/bootstrap.css")

	ui.includeJavascript("edtriageapp", "filters.js")
	ui.includeJavascript("edtriageapp", "components/EdTriageConceptFactory.js")
	ui.includeJavascript("edtriageapp", "components/EdTriagePatientService.js")
	ui.includeJavascript("edtriageapp", "components/EdTriageEditPatientController.js")
	ui.includeJavascript("edtriageapp", "app.js")


%>


<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
	var breadcrumbs = [
		{ icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm' },
		{ label: "${ ui.message("edtriageapp.label") }", link: "${ ui.pageLink("edtriageapp", "findPatient?app=" + appId) }" },

	];

</script>


<div class="container" ng-app="edTriageApp" ng-controller="patientQueueController">
	Queue Goes Here
	<div class="table-responsive">
		<table class="table">
			<thead>
			<tr>
				<th>Score</th>
				<th>Patient</th>
				<th>Wait time</th>
				<th>Chief complaint</th>
				<th>Vitals</th>
				<th>Symptoms</th>
				<th>Actions</th>
			</tr>
			</thead>
			<tbody>
			<tr>
				<td><div class="progress-bar" role="progressbar" aria-valuenow="40"
												 aria-valuemin="0" aria-valuemax="100" style="width:100%;background-color:green;">
					Green (Score:0)
				</div>
				</td>
				<td>Anna id #xxxx</td>
				<td>1:23</td>
				<td>Stomach hurts</td>
				<td>Vitals</td>
				<td>Symptoms</td>
				<td>
					<button type="button" class="btn btn-primary" ng-disabled="isSaving" ng-click="beginConsult()">Begin Consult</button>
					<button type="button" class="btn btn-primary" ng-disabled="isSaving" ng-click="removeEdTriage()">Remove</button>
				</td>
			</tr>
			</tbody>
		</table>
	</div>
	<div>
		<a href="${ ui.pageLink("edtriageapp", "findPatient?appId=" + appId) }" role="button" class="btn">Add New Patient to the Queue</a>
	</div>
</div>



<script type="text/javascript">
	jq(function() {
		// make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
		jq(document).on('sessionLocationChanged', function() {
			window.location.reload();
		});
	});
</script>
