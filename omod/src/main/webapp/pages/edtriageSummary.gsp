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
							{{edTriagePatient.percentComplete}}{{additionalData.language.percentComplete}}
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
			<h3 class="panel-title">{{translations.complaint}}</h3>
		</div>
		<div class="panel-body">
			<textarea class="form-control" id="complaint" rows="3"
					  ng-model="edTriagePatient.complaint"></textarea>
		</div>
	</div>


	<div class="panel panel-info">
		<div class="panel-heading">
			<h3 class="panel-title">{{additionalData.language.vitals | translateDebug}}</h3>
		</div>
		<div class="panel-body">
			<div class="form-group row">
				<label for="mobility" class="col-sm-2 form-control-label">{{additionalData.language.mobility}}</label>
				<div class="col-sm-10">
					<select class="form-control" id="mobility"
							ng-model="edTriagePatient.vitals.mobility">
						<option ng-repeat="tp in Concepts.mobility.answers" value="{{tp.uuid}}">{{tp.uuid | translateDebug}}</option>
					</select>
				</div>
			</div>
			<div class="form-group row">
				<label for="respiratoryRate" class="col-sm-2 form-control-label">{{additionalData.language.respiratoryRate}}</label>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="respiratoryRate" type="text"
						   ng-model="edTriagePatient.vitals.respiratoryRate" />
				</div>
				<div class="col-sm-1 form-control-label pull-left">{{additionalData.language.perMinute}}</div>
			</div>
			<div class="form-group row">
				<label for="oxygenSaturation" class="col-sm-2 form-control-label">{{additionalData.language.oxygenSaturation}}</label>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="oxygenSaturation" type="text"
						   ng-model="edTriagePatient.vitals.oxygenSaturation" />
				</div>
				<div class="col-sm-1 form-control-label pull-left">{{additionalData.language.percent}}</div>
				<div class="col-sm-2 form-control-label pull-left">
					<button type="button" class="btn btn-primary btn-sm" ng-click="handleCustomAction('re')">
						{{additionalData.language.unobtainable}}
					</button>
				</div>
			</div>
			<div class="form-group row">
				<label for="heartRate" class="col-sm-2 form-control-label">{{additionalData.language.heartRate}}</label>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="heartRate" type="text"
						   ng-model="edTriagePatient.vitals.heartRate" />
				</div>
				<div class="col-sm-1 form-control-label pull-left">{{additionalData.language.perMinute}}</div>
			</div>
			<div class="form-group row">
				<label for="bloodPressure" class="col-sm-2 form-control-label">Blood Pressure</label>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="bloodPressure" type="text"
						   ng-model="edTriagePatient.vitals.bloodPressure.systolic" />
				</div>
				<div class="col-sm-1 form-control-label pull-left">/</div>
				<div class="col-sm-2 form-control-label">
					<input class="form-control" id="bloodPressure2" type="text"
						   ng-model="edTriagePatient.vitals.bloodPressure.systolic" />
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

			<div class="form-group row">
				<label for="consciousness" class="col-sm-2 form-control-label">Consciousness</label>
				<div class="col-sm-10">
					<select class="form-control" id="consciousness"
							ng-model="edTriagePatient.vitals.consciousness">
						<option ng-repeat="tp in additionalData.CONSTANTS.CONSCIOUSNESS_TYPES" value="{{tp.id}}">{{tp.descriptionKey}}</option>
					</select>
				</div>
			</div>

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
			<h3 class="panel-title">{{additionalData.language.symptoms}}</h3>
		</div>
		<div class="panel-body">
			<div class="form-group row">
				<label for="neurological" class="col-sm-2 form-control-label">neurological</label>
				<div class="col-sm-10">
					<select class="form-control" id="neurological"
							ng-model="edTriagePatient.vitals.neurological">
						<option ng-repeat="tp in additionalData.CONSTANTS.CONSCIOUSNESS_TYPES" value="{{tp.id}}">{{tp.descriptionKey}}</option>
					</select>
				</div>
			</div>
			<div class="form-group row">
				<label for="burn" class="col-sm-2 form-control-label">burn</label>
				<div class="col-sm-10">
					<select class="form-control" id="burn"
							ng-model="edTriagePatient.vitals.burn">
						<option ng-repeat="tp in additionalData.CONSTANTS.CONSCIOUSNESS_TYPES" value="{{tp.id}}">{{tp.descriptionKey}}</option>
					</select>
				</div>
			</div>
			<div class="form-group row">
				<label for="trauma" class="col-sm-2 form-control-label">trauma</label>
				<div class="col-sm-10">
					<select class="form-control" id="trauma"
							ng-model="edTriagePatient.vitals.trauma">
						<option ng-repeat="tp in additionalData.CONSTANTS.CONSCIOUSNESS_TYPES" value="{{tp.id}}">{{tp.descriptionKey}}</option>
					</select>
				</div>
			</div>
			<div class="form-group row">
				<label for="digestive" class="col-sm-2 form-control-label">digestive</label>
				<div class="col-sm-10">
					<select class="form-control" id="digestive"
							ng-model="edTriagePatient.vitals.trauma">
						<option ng-repeat="tp in additionalData.CONSTANTS.CONSCIOUSNESS_TYPES" value="{{tp.id}}">{{tp.descriptionKey}}</option>
					</select>
				</div>
			</div>
			<div class="form-group row">
				<label for="pregnancy" class="col-sm-2 form-control-label">pregnancy</label>
				<div class="col-sm-10">
					<select class="form-control" id="pregnancy"
							ng-model="edTriagePatient.vitals.trauma">
						<option ng-repeat="tp in additionalData.CONSTANTS.CONSCIOUSNESS_TYPES" value="{{tp.id}}">{{tp.descriptionKey}}</option>
					</select>
				</div>
			</div>
			<div class="form-group row">
				<label for="respiratory" class="col-sm-2 form-control-label">respiratory</label>
				<div class="col-sm-10">
					<select class="form-control" id="respiratory"
							ng-model="edTriagePatient.vitals.trauma">
						<option ng-repeat="tp in additionalData.CONSTANTS.CONSCIOUSNESS_TYPES" value="{{tp.id}}">{{tp.descriptionKey}}</option>
					</select>
				</div>
			</div>
			<div class="form-group row">
				<label for="pain" class="col-sm-2 form-control-label">pain</label>
				<div class="col-sm-10">
					<select class="form-control" id="pain"
							ng-model="edTriagePatient.vitals.pain">
						<option ng-repeat="tp in additionalData.CONSTANTS.CONSCIOUSNESS_TYPES" value="{{tp.id}}">{{tp.descriptionKey}}</option>
					</select>
				</div>
			</div>
			<div class="form-group row">
				<label for="other" class="col-sm-2 form-control-label">other</label>
				<div class="col-sm-10">
					<select class="form-control" id="other"
							ng-model="edTriagePatient.vitals.other">
						<option ng-repeat="tp in additionalData.CONSTANTS.CONSCIOUSNESS_TYPES" value="{{tp.id}}">{{tp.descriptionKey}}</option>
					</select>
				</div>
			</div>

		</div>
	</div>


	<div class="form-group row">
		<button type="button" class="btn btn-primary btn-lg pull-right" ng-click="save()">
			{{additionalData.language.submitButton}}
		</button>
		<button type="button" class="btn btn-secondary btn-lg pull-right" ng-click="cancel()">
			{{additionalData.language.exitButton}}
		</button>
	</div>

	<div ng-if="additionalData.debug">
		<h1>Debug Info:</h1>
		<pre>
		</pre>
	</div>


</div>

{{edTriagePatient | json}}
