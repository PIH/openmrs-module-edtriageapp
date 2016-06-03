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
		{ label: "${ ui.escapeJs(ui.format(patient.patient)) }" , link: '${ui.pageLink("coreapps", "patientdashboard/patientDashboard", [patientId: patient.id])}'},
	];

</script>


${ ui.includeFragment("coreapps", "patientHeader", [ patient: patient ]) }


<div class="container" ng-app="edTriageApp" ng-controller="patientEditController">

	<div class="panel panel-info">
		<div class="panel-heading">
			<h3 class="panel-title">${ui.message("uicommons.patient")}</h3>
		</div>
		<div class="panel-body">
			Patient Id #{{edTriagePatient.patientId}}
		</div>
	</div>

	<div class="panel panel-info">
		<div class="panel-heading">
			<h3 class="panel-title">
				<div class="row">
					<div class="col-xs-1">${ ui.message("edtriageapp.status") }</div>
					<div class="col-xs-11">
						<div class="progress-bar" role="progressbar" aria-valuenow="40"
							 aria-valuemin="0" aria-valuemax="100" style="width:{{edTriagePatient.percentComplete}}%">
							{{edTriagePatient.percentComplete}}{{translations.percentComplete}}
						</div>
					</div>
				</div>
			</h3>
		</div>
		<div class="panel-body">
			<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100"
				 aria-valuemin="0" aria-valuemax="100" style="height:50px;width:100%">
				{{additionalData.triageColorText}}
			</div>

		</div>
	</div>

	<div class="panel panel-info">
		<div class="panel-heading">
			<h3 class="panel-title">{{edTriagePatientConcept.chiefComplaint.label}}</h3>
		</div>
		<div class="panel-body">
			<textarea class="form-control" id="complaint" rows="3"
					  ng-model="edTriagePatient.complaint"></textarea>
		</div>
	</div>


	<div class="panel panel-info">
		<div class="panel-heading">
			<h3 class="panel-title">{{translations.vitals}}</h3>
		</div>
		<div class="panel-body">
			<concept-selector concept="edTriagePatientConcept.vitals.mobility" selected-concept="edTriagePatient.vitals.mobility"></concept-selector>

			<div class="form-group row">
				<label for="respiratoryRate" class="col-sm-2 form-control-label">{{edTriagePatientConcept.vitals.respiratoryRate.label}}</label>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="respiratoryRate" type="text"
						   ng-model="edTriagePatient.vitals.respiratoryRate" />
				</div>
				<div class="col-sm-1 form-control-label pull-left">{{translations.perMinute}}</div>
			</div>
			<div class="form-group row">
				<label for="oxygenSaturation" class="col-sm-2 form-control-label">{{translations.oxygenSaturation}}</label>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="oxygenSaturation" type="text"
						   ng-model="edTriagePatient.vitals.oxygenSaturation" />
				</div>
				<div class="col-sm-1 form-control-label pull-left">{{translations.percent}}</div>
				<div class="col-sm-2 form-control-label pull-left">
					<button type="button" class="btn btn-primary btn-sm" ng-click="handleCustomAction('re')">
						{{translations.unobtainable}}
					</button>
				</div>
			</div>
			<div class="form-group row">
				<label for="heartRate" class="col-sm-2 form-control-label">{{translations.heartRate}}</label>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="heartRate" type="text"
						   ng-model="edTriagePatient.vitals.heartRate" />
				</div>
				<div class="col-sm-1 form-control-label pull-left">{{translations.perMinute}}</div>
			</div>
			<div class="form-group row">
				<label for="bloodPressureSystolic" class="col-sm-2 form-control-label">Blood Pressure</label>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="bloodPressureSystolic" type="text"
						   ng-model="edTriagePatient.vitals.bloodPressure.systolic" />
				</div>
				<div class="col-sm-1 form-control-label pull-left">/</div>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="bloodPressureDiastolic" type="text"
						   ng-model="edTriagePatient.vitals.bloodPressure.diastolic" />
				</div>
			</div>

			<div class="form-group row">
				<label for="temperatureC" class="col-sm-2 form-control-label">Temperature</label>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="temperatureC" type="text"
						   ng-model="edTriagePatient.vitals.temperature" />
				</div>
				<div class="col-sm-1 form-control-label pull-left">C</div>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="temperatureF" type="text"
						   ng-model="edTriagePatient.vitals.temperature" />
				</div>
				<div class="col-sm-1 form-control-label pull-left">F</div>
			</div>

			<concept-selector concept="edTriagePatientConcept.vitals.consciousness" selected-concept="edTriagePatient.vitals.consciousness"></concept-selector>

			<div class="form-group row">
				<label class="col-sm-2 form-control-label">Trauma</label>
				<div class="col-sm-10">
					<label class="radio-inline"><input type="radio" name="trauma" ng-model="edTriagePatient.vitals.trauma">Yes</label>
					<label class="radio-inline"><input type="radio" name="trauma">No</label>
				</div>
			</div>

			<div class="form-group row">
				<label for="temperatureC" class="col-sm-2 form-control-label">Weight</label>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="weigthInKG" type="text"
						   ng-model="edTriagePatient.vitals.weight" />
				</div>
				<div class="col-sm-1 form-control-label pull-left">kgs.</div>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="weightInLb" type="text"
						   ng-model="edTriagePatient.vitals.weight" />
				</div>
				<div class="col-sm-1 form-control-label pull-left">lbs/</div>
			</div>
		</div>

	</div>

	<div class="panel panel-info">
		<div class="panel-heading">
			<h3 class="panel-title">{{translations.symptoms}}</h3>
		</div>
		<div class="panel-body">
			<concept-selector concept="edTriagePatientConcept.symptoms.neurological" selected-concept="edTriagePatient.symptoms.neurological"></concept-selector>
			<concept-selector concept="edTriagePatientConcept.symptoms.burn" selected-concept="edTriagePatient.symptoms.burn"></concept-selector>
			<concept-selector concept="edTriagePatientConcept.symptoms.trauma" selected-concept="edTriagePatient.symptoms.trauma"></concept-selector>
			<concept-selector concept="edTriagePatientConcept.symptoms.digestive" selected-concept="edTriagePatient.symptoms.digestive"></concept-selector>
			<concept-selector concept="edTriagePatientConcept.symptoms.pregnancy" selected-concept="edTriagePatient.symptoms.pregnancy"></concept-selector>
			<concept-selector concept="edTriagePatientConcept.symptoms.respiratory" selected-concept="edTriagePatient.symptoms.respiratory"></concept-selector>
			<concept-selector concept="edTriagePatientConcept.symptoms.pain" selected-concept="edTriagePatient.symptoms.pain"></concept-selector>
			<concept-selector concept="edTriagePatientConcept.symptoms.other" selected-concept="edTriagePatient.symptoms.other"></concept-selector>
		</div>
	</div>


	<div class="form-group row">
		<button type="button" class="btn btn-primary btn-lg pull-right" ng-click="save()">
			{{translations.submitButton}}
		</button>
		<button type="button" class="btn btn-secondary btn-lg pull-right" ng-click="cancel()">
			{{translations.exitButton}}
		</button>
	</div>

	<div ng-if="additionalData.debug">
		<h1>Debug Info:</h1>
		<pre>
			{{edTriagePatient | json}}
		</pre>
	</div>


</div>



<script type="text/javascript">
	angular.module('edTriageApp')
			.value('patientUuid', '${ patient.uuid }')


	;
	//angular.bootstrap('#edTriageApp', [ "edTriageApp" ])   ;

	jq(function() {
		// make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
		jq(document).on('sessionLocationChanged', function() {
			window.location.reload();
		});
	});

</script>
