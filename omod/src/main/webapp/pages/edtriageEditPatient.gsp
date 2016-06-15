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
    ui.includeJavascript("uicommons", "filters/serverDate.js")

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

<style>

	#sticky {
		padding: 0.5ex;

		/*color: #fff;*/
		/*font-size: 2em;*/
		/*border-radius: 0.5ex;*/
	}

	#sticky.stick {
		width: 50%;
		margin-top: 0 !important;
		position: fixed;
		top: 0;
		z-index: 10000;
		/*border-radius: 0 0 0.5em 0.5em;*/
	}

</style>

<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
	var breadcrumbs = [
		{ icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm' },
		{ label: "${ ui.message("edtriageapp.label") }", link: "${ ui.pageLink("edtriageapp", "findPatient?appId=" + appId) }" },
		{ label: "${ ui.escapeJs(ui.format(patient.patient)) }" , link: '${ui.pageLink("coreapps", "patientdashboard/patientDashboard", [patientId: patient.id])}'},
	];

	function sticky_relocate() {
		var window_top = jq(window).scrollTop();
		var div_top = jq('#sticky-anchor').offset().top;
		if (window_top > div_top) {
			jq('#sticky').addClass('stick');
			jq('#sticky-anchor').height(jq('#sticky').outerHeight());
		} else {
			jq('#sticky').removeClass('stick');
			jq('#sticky-anchor').height(0);
		}
	}

	jq(function() {
		console.log("jquery is working");

		jq(window).scroll(sticky_relocate);
		sticky_relocate();

	});

</script>


${ ui.includeFragment("coreapps", "patientHeader", [ patient: patient ]) }


<div class="container" ng-app="edTriageApp" ng-controller="patientEditController">

	<div class="panel panel-info">
		<div class="panel-heading">
			<h3 class="panel-title">${ui.message("uicommons.patient")}</h3>
		</div>
		<div class="panel-body">
			Patient Id {{edTriagePatient.patient.uuid}} ({{edTriagePatient.patient.gender}} age {{edTriagePatient.patient.age}})
		</div>
	</div>

	<div id="sticky-anchor"></div>
	<div class="panel panel-info" id="sticky">
		<div class="panel-heading">
			<h3 class="panel-title">
				<div class="row">
					<div class="col-sm-1">${ ui.message("edtriageapp.status") }</div>
					<div class="col-sm-11">
						<div class="progress-bar" role="progressbar" aria-valuenow="40"
							 aria-valuemin="0" aria-valuemax="100" style="width:{{edTriagePatient.percentComplete}}%">
							{{edTriagePatient.percentComplete}}${ ui.message("edtriageapp.percentComplete") }
						</div>
					</div>
				</div>
			</h3>
		</div>
		<div class="panel-body">
			<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100"
				 aria-valuemin="0" aria-valuemax="100" style="height:50px;width:100%;background-color: {{currentScore.colorClass}};">
				{{currentScore.numericScore}}
			</div>

		</div>
	</div>


	<div class="panel panel-info">
		<div class="panel-heading">
			<h3 class="panel-title">{{edTriagePatientConcept.chiefComplaint.label}}</h3>
		</div>
		<div class="panel-body">
			<textarea class="form-control" id="complaint" rows="3"
					  ng-model="edTriagePatient.chiefComplaint.value"></textarea>
		</div>
	</div>


    <div class="row">
        <div class="col-sm-6">
            <div class="panel panel-info">
                <div class="panel-heading">
                    <h3 class="panel-title">${ ui.message("edtriageapp.vitals") }</h3>
                </div>
                <div class="panel-body">

                    <concept-selector ed-triage-patient="edTriagePatient" concept="edTriagePatientConcept.vitals.mobility" selected-concept="edTriagePatient.vitals.mobility.value"></concept-selector>

                    <div class="form-group row">
                        <label for="respiratoryRate" class="col-sm-2 form-control-label">{{edTriagePatientConcept.vitals.respiratoryRate.label}}</label>
                        <div class="col-sm-2 form-control-label">
                            <input class="form-control" id="respiratoryRate" type="number" min="1" max="200"
                                   ng-model="edTriagePatient.vitals.respiratoryRate.value" />
                        </div>
                        <div class="col-sm-1 form-control-label pull-left">${ ui.message("edtriageapp.perMinute") }</div>
                    </div>
                    <div class="form-group row">
                        <label for="oxygenSaturation" class="col-sm-2 form-control-label">{{edTriagePatientConcept.vitals.oxygenSaturation.label}}</label>
                        <div class="col-sm-2 form-control-label">
                            <input class="form-control" id="oxygenSaturation" type="number" min="1" max="100"
                                   ng-model="edTriagePatient.vitals.oxygenSaturation.value" />
                        </div>
                        <div class="col-1 form-control-label pull-left">${ ui.message("edtriageapp.percent")}</div>
                        <div class="col-sm-2 form-control-label pull-left">
                            <button type="button" class="btn btn-primary btn-sm" ng-click="handleCustomAction('re')">
                                ${ ui.message("edtriageapp.unobtainable") }
                            </button>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="heartRate" class="col-sm-2 form-control-label">{{edTriagePatientConcept.vitals.heartRate.label}}</label>
                        <div class="col-sm-2 form-control-label">
                            <input class="form-control" id="heartRate" type="number" min="1" max="1000"
                                   ng-model="edTriagePatient.vitals.heartRate.value" />
                        </div>
                        <div class="col-sm-1 form-control-label pull-left">${ ui.message("edtriageapp.perMinute") }</div>
                    </div>
                    <div class="form-group row">
                        <label for="bloodPressureSystolic" class="col-sm-2 form-control-label">${ ui.message("edtriageapp.bloodPressure") } </label>
                        <div class="col-sm-2 form-control-label">
                            <input class="form-control" id="bloodPressureSystolic" type="number" min="1" max="1000"
                                   ng-model="edTriagePatient.vitals.systolicBloodPressure.value" />
                        </div>
                        <div class="col-sm-1 form-control-label pull-left">/</div>
                        <div class="col-sm-2 form-control-label">
                            <input class="form-control" id="bloodPressureDiastolic" type="number" min="1" max="1000"
                                   ng-model="edTriagePatient.vitals.diastolicBloodPressure.value" />
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="temperatureC" class="col-sm-2 form-control-label">{{edTriagePatientConcept.vitals.temperature.label}}</label>
                        <div class="col-sm-2 form-control-label">
                            <input class="form-control" id="temperatureC" type="number" min="1" max="50"
                                   ng-model="edTriagePatient.vitals.temperature.value" />
                        </div>
                        <div class="col-sm-1 form-control-label pull-left">C</div>
                    </div>

                    <concept-selector ed-triage-patient="edTriagePatient" concept="edTriagePatientConcept.vitals.consciousness" selected-concept="edTriagePatient.vitals.consciousness.value"></concept-selector>

                    <div class="form-group row">
                        <label class="col-sm-2 form-control-label">Trauma??</label>
                        <div class="col-sm-10">
                            <label class="radio-inline"><input type="radio" name="trauma" ng-model="edTriagePatient.vitals.trauma.value">Yes</label>
                            <label class="radio-inline"><input type="radio" name="trauma">No</label>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="temperatureC" class="col-sm-2 form-control-label">{{edTriagePatientConcept.vitals.weight.label}}</label>
                        <div class="col-sm-2 form-control-label">
                            <input class="form-control" id="weigthInKG" type="number" min="1" max="2000"
                                   ng-model="edTriagePatient.vitals.weight.value" />
                        </div>
                        <div class="col-sm-1 form-control-label pull-left">kgs.</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="panel panel-info">
                <div class="panel-heading">
                    <h3 class="panel-title">${ ui.message("edtriageapp.symptoms") }</h3>
                </div>
                <div class="panel-body">
                    <concept-selector ed-triage-patient="edTriagePatient" input-id="'neurological'" concept="edTriagePatientConcept.symptoms.neurological" selected-concept="edTriagePatient.symptoms.neurological.value"></concept-selector>
                    <concept-selector ed-triage-patient="edTriagePatient" input-id="'burn'" concept="edTriagePatientConcept.symptoms.burn" selected-concept="edTriagePatient.symptoms.burn.value"></concept-selector>
                    <concept-selector ed-triage-patient="edTriagePatient" input-id="'trauma'" concept="edTriagePatientConcept.symptoms.trauma" selected-concept="edTriagePatient.symptoms.trauma.value"></concept-selector>
                    <concept-selector ed-triage-patient="edTriagePatient" input-id="'digestive'" concept="edTriagePatientConcept.symptoms.digestive" selected-concept="edTriagePatient.symptoms.digestive.value"></concept-selector>
                    <concept-selector ed-triage-patient="edTriagePatient" input-id="'pregnancy'" ng-if="edTriagePatient.patient.gender == 'F'" concept="edTriagePatientConcept.symptoms.pregnancy" selected-concept="edTriagePatient.symptoms.pregnancy.value"></concept-selector>
                    <concept-selector ed-triage-patient="edTriagePatient" input-id="'respiratory'" concept="edTriagePatientConcept.symptoms.respiratory" selected-concept="edTriagePatient.symptoms.respiratory.value"></concept-selector>
                    <concept-selector ed-triage-patient="edTriagePatient" input-id="'pain'" concept="edTriagePatientConcept.symptoms.pain" selected-concept="edTriagePatient.symptoms.pain.value"></concept-selector>
                    <concept-selector ed-triage-patient="edTriagePatient" input-id="'other'" concept="edTriagePatientConcept.symptoms.other" selected-concept="edTriagePatient.symptoms.other.value"></concept-selector>
                </div>
            </div>
        </div>
    </div>

	<div class="alert alert-{{message.type}} alert-dismissible fade in" role="alert" ng-show="message.text.length > 0">
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		{{message.text}}
	</div>

	<div>
		<button type="button" class="btn btn-primary" ng-disabled="isSaving" ng-click="save()">${ ui.message("edtriageapp.submitButton") }</button>
		<a href="${ ui.pageLink("edtriageapp", "edtriageViewQueue?appId=" + appId) }" class="btn btn-default" role="button">${ ui.message("edtriageapp.viewQueueButton") }</a>
		<a href="${ ui.pageLink("edtriageapp", "findPatient?appId=" + appId) }" class="btn btn-default" role="button">${ ui.message("edtriageapp.exitButton") }</a>
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
						<h2>Patient</h2>
						<pre>{{edTriagePatient | json}}</pre>
					</div>
					<div>
						<h2>Concept</h2>
						<pre>{{edTriagePatientConcept | json}}</pre>
					</div>
				</div>
			</div>
		</div>
	</div>


</div>



<script type="text/javascript">
	angular.module('edTriageApp')
			.value('patientUuid', '${ patient.uuid }')
			.value('patientBirthDate', '${ patient.birthdate }')
			.value('patientGender', '${ patient.gender }')
			.value('locationUuid', '${ location.uuid }')

	;
	//angular.bootstrap('#edTriageApp', [ "edTriageApp" ])   ;

	jq(function() {
		// make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
		jq(document).on('sessionLocationChanged', function() {
			window.location.reload();
		});
	});

</script>
