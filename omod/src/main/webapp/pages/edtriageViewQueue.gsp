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

	ui.includeJavascript("edtriageapp", "constants.js")
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

	The queue goes here

</div>



<script type="text/javascript">
	jq(function() {
		// make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
		jq(document).on('sessionLocationChanged', function() {
			window.location.reload();
		});
	});
</script>
