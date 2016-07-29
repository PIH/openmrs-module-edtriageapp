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
	ui.includeJavascript("uicommons", "services/conceptService.js")
    ui.includeJavascript("uicommons", "directives/coded-or-free-text-answer.js")
    ui.includeJavascript("uicommons", "filters/serverDate.js")
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

	def middleLabel = returnLabel ?:  ui.message("edtriageapp.label")
	def middleUrl   = returnUrl ?:  ui.pageLink("coreapps", "findpatient/findPatient?app=" + appId)

%>

<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
	var breadcrumbs = [
		{ icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm' },
		{ label: "${ middleLabel }", link: "${ middleUrl }" },
		{ label: "${ ui.escapeJs(ui.format(patient)) }" , link: '${ui.pageLink("coreapps", "patientdashboard/patientDashboard", [patientId: patient.id])}'},
	];

	function sticky_relocate() {
		var window_top = jq(window).scrollTop();
		var div_top = jq('#sticky-anchor').offset().top;
		// UHM-2519, add a buffer before re-positioning the div to prevent the jittering
		if (window_top > (div_top + 30 ) ) {
			jq('#sticky').addClass('stick');
			jq('#sticky-anchor').height(jq('#sticky').outerHeight());
		} else if (window_top < (div_top - 70 )) {
			jq('#sticky').removeClass('stick');
			jq('#sticky-anchor').height(0);
		}
	}

	jq(function() {
		jq(window).scroll(sticky_relocate);
		sticky_relocate();
	});

</script>

<style>


</style>

${ ui.includeFragment("coreapps", "patientHeader", [ patient: patient ]) }

<div class="container" ng-app="edTriageApp" ng-controller="patientEditController" ng-show="loading_complete">
	<div id="sticky-anchor"></div>
	<div class="panel progress-bar edtriage-label-{{currentScore.colorClass}}" role="progressbar" aria-valuenow="100"
		 aria-valuemin="0" aria-valuemax="100" id="sticky">
		<div class="panel-heading">
			<h3 class="panel-title">
				<div class="row">
					<div class="col-sm-1">${ ui.message("edtriageapp.status") }</div>
				</div>
			</h3>
		</div>

	</div>


	<div class="panel panel-info">
		<div class="panel-heading">
			<h3 class="panel-title">${ ui.message("edtriageapp.chiefComplaint") }</h3>
		</div>
		<div class="panel-body">
			<textarea ng-show="editable" class="form-control" id="complaint" rows="3"
					  ng-model="edTriagePatient.chiefComplaint.value"></textarea>
			<span ng-hide="editable">{{ edTriagePatient.chiefComplaint.value }}</span>
		</div>
	</div>

	<div class="panel panel-info">
		<div class="panel-heading">
			<h3 class="panel-title">{{edTriagePatientConcept.vitals.weight.label}}</h3>
		</div>
		<div class="panel-body">
			<div class="row">
				<div class="col-xs-2">
					<input ng-disabled="!editable" class="form-control" id="weight_in_kg" type="number" min="1" max="2000"  ng-change="handleWeightChange('kg')"
					   ng-model="weightInKg" />
				</div>
				<div class="col-xs-1">
					${ui.message("uicommons.units.kilograms")}
				</div>
				<div class="col-xs-2">
					<input ng-disabled="!editable" class="form-control" id="weight_in_lb" type="number" min="1" max="2000" ng-change="handleWeightChange('lb')"
					   ng-model="weightInLb" />
				</div>
				<div class="col-xs-1 text-left">
					${ui.message("uicommons.units.lbs")}
				</div>
			</div>
		</div>
	</div>

    <form class="form-horizontal">
    <div class="row">
        <div class="col-sm-6">
            <div class="panel panel-info">
                <div class="panel-heading">
                    <h3 class="panel-title">${ ui.message("edtriageapp.vitals") }</h3>
                </div>
                <div class="panel-body ">
					<table class="table table-condensed borderless">
						<thead>
						<tr ng-if="debug">
							<th class="col-xs-4">Large</th>
							<th class="col-xs-4">Small</th>
							<th class="col-xs-1">Small</th>
							<th class="col-xs-4">Small</th>
							<th class="col-xs-2">Small</th>
							<th class="col-xs-1">Small</th>
						</tr>
						</thead>
						<tbody>
						<tr concept-selector-row ed-triage-patient="edTriagePatient"
							editable="editable"
							concept="edTriagePatientConcept.vitals.mobility"
							concept-label="'${ui.message("edtriageapp.mobility")}'"
							sorter="sortAnswer"
							selected-concept="edTriagePatient.vitals.mobility.value"
							score-label-class="'edtriage-label-score'"
							score="currentScore.individualScores[edTriagePatient.vitals.mobility.value]"></tr>
						<tr>
							<td><label>{{edTriagePatientConcept.vitals.respiratoryRate.label}}</label></td>
							<td colspan="3"><input ng-disabled="!editable" class="form-control" type="number" min="1" max="200"
									   ng-model="edTriagePatient.vitals.respiratoryRate.value" /></td>
							<td><small>${ ui.message("edtriageapp.perMinute") }</small></td>
							<td><score-display score-label-class="'edtriage-label-score'" score="currentScore.individualScores[edTriagePatientConcept.vitals.respiratoryRate.uuid]"></score-display></td>
						</tr>

						<tr>
							<td><label>{{edTriagePatientConcept.vitals.oxygenSaturation.label}}</label></td>
							<td colspan="3"><input ng-disabled="!editable" class="form-control" id="oxygenSaturation" type="number" min="1" max="100"
										ng-model="edTriagePatient.vitals.oxygenSaturation.value" /></td>
							<td><small>${ ui.message("edtriageapp.percent") }</small></td>
							<td><score-display score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatientConcept.vitals.oxygenSaturation.uuid)" score="currentScore.individualScores[edTriagePatientConcept.vitals.oxygenSaturation.uuid]"></score-display></td>
						</tr>

						<tr>
							<td><label>{{edTriagePatientConcept.vitals.heartRate.label}}</label></td>
							<td colspan="3"><input ng-disabled="!editable" class="form-control" id="heartRate" type="number" min="1" max="999"
									   ng-model="edTriagePatient.vitals.heartRate.value" /></td>
							<td><small>${ ui.message("edtriageapp.perMinute") }</small></td>
							<td><score-display score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatientConcept.vitals.heartRate.uuid)" score="currentScore.individualScores[edTriagePatientConcept.vitals.heartRate.uuid]"></score-display></td>
						</tr>

						<tr ng-if="edTriagePatientConcept.vitals.systolicBloodPressure.scope.indexOf(edTriagePatient.patient.ageType) > -1">
							<td><label>${ ui.message("edtriageapp.bloodPressure") }</label></td>
							<td>
								<input ng-disabled="!editable" class="form-control edtriage-weight-box" id="bloodPressureSystolic" type="number" min="1" max="999"
									   ng-model="edTriagePatient.vitals.systolicBloodPressure.value" />
							</td>
							<td class="text-center">/</td>
							<td>
								<input ng-disabled="!editable" class="form-control edtriage-weight-box" style="" id="bloodPressureDiastolic" type="number" min="1" max="999"
									   ng-model="edTriagePatient.vitals.diastolicBloodPressure.value" />

							</td>
							<td></td>
							<td><score-display score-label-class="'edtriage-label-score'" score="currentScore.individualScores[edTriagePatientConcept.vitals.systolicBloodPressure.uuid]"></score-display></td>
						</tr>

						<tr>
							<td><label>${ui.message("edtriageapp.temperature")}</label></td>
							<td><input ng-disabled="!editable" class="form-control" id="temperatureC" type="number" min="1" max="100"
									   ng-model="tempInC" ng-change="handleTempChange('c')" /></td>
							<td class="pull-left">C</td>
							<td><input ng-disabled="!editable" class="form-control" id="temperatureF" type="number" min="32" max="212"
									   ng-model="tempInF" ng-change="handleTempChange('f')" /></td>
							<td>F</td>
							<td><score-display score-label-class="'edtriage-label-score'" score="currentScore.individualScores[edTriagePatientConcept.vitals.temperature.uuid]"></score-display></td>
						</tr>

						<tr concept-selector-row ed-triage-patient="edTriagePatient" concept="edTriagePatientConcept.vitals.consciousness"
							editable="editable"
							sorter="sortAnswer"
							concept-label="'${ui.message("edtriageapp.consciousness")}'"
							selected-concept="edTriagePatient.vitals.consciousness.value" score-label-class="'edtriage-label-score'"
							score="currentScore.individualScores[edTriagePatient.vitals.consciousness.value]"></tr>

						<tr>
							<td><label>${ui.message("edtriageapp.trauma")}</label></td>
							<td>
								<label class="radio-inline"><input type="radio" name="trauma" ng-model="edTriagePatient.vitals.trauma.value" ng-value="edTriagePatientConcept.vitals.trauma.answers[0].uuid">${ ui.message("uicommons.yes")}</label>
								</td>
							<td>
								<label class="radio-inline"><input type="radio" name="trauma" ng-model="edTriagePatient.vitals.trauma.value" ng-value="">${ ui.message("uicommons.no")} </label>
							</td>
							<td></td>
							<td></td>
							<td><score-display score-label-class="'edtriage-label-score'" score="currentScore.individualScores[edTriagePatientConcept.vitals.trauma.answers[0].uuid]"></score-display></td>
						</tr>
						<tr ng-if="edTriagePatient.patient.lessThan4WeeksOld">
							<td>${ui.message("Person.age")}</td>
							<td colspan="4">${ ui.message("edtriageapp.lessThan4WeeksOld") }</td>
							<td><score-display score-label-class="'edtriage-label-red'" score="'&nbsp;&nbsp;'"></score-display></td>
						</tr>
						<tr>
							<td><label>${ui.message("edtriageapp.total")}</label></td>
							<td colspan="4"></td>
							<td><h2><span class="label edtriage-label-score">{{currentScore.numericScore}}</span></h2></td>
						</tr>
						</tbody>
						</table>
                </div>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="panel panel-info">
                <div class="panel-heading">
                    <h3 class="panel-title">${ ui.message("edtriageapp.symptoms") }</h3>
                </div>
                <div class="panel-body">
					<table class="borderless">
						<tbody>
							<tr concept-selector-row ed-triage-patient="edTriagePatient" input-id="'neurological'" concept="edTriagePatientConcept.symptoms.neurological"
								editable="editable"
								sorter="sortAnswer"
								selected-concept="edTriagePatient.symptoms.neurological.value"  concept-label="'${ui.message("edtriageapp.neurological")}'"
								score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatient.symptoms.neurological.value)"></tr>
						                     <!-- getColorClass(currentScore.individualScores[edTriagePatient.symptoms.neurological.value])-->
							<tr concept-selector-row ed-triage-patient="edTriagePatient" input-id="'burn'" concept="edTriagePatientConcept.symptoms.burn"
								editable="editable"
								sorter="sortAnswer"
								selected-concept="edTriagePatient.symptoms.burn.value"  concept-label="'${ui.message("edtriageapp.burn")}'"
								score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatient.symptoms.burn.value)"></tr>

							<tr concept-selector-row ed-triage-patient="edTriagePatient" input-id="'diabetic'" concept="edTriagePatientConcept.symptoms.diabetic"
								ng-if="edTriagePatient.patient.age > 3"
								editable="editable"
								sorter="sortAnswer"
								selected-concept="edTriagePatient.symptoms.diabetic.value"  concept-label="'${ui.message("edtriageapp.diabetic")}'"
								score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatient.symptoms.diabetic.value)"></tr>

							<tr concept-selector-row ed-triage-patient="edTriagePatient" input-id="'trauma'" concept="edTriagePatientConcept.symptoms.trauma"
								editable="editable"
								sorter="sortAnswer"
								selected-concept="edTriagePatient.symptoms.trauma.value" concept-label="'${ui.message("edtriageapp.trauma")}'"
								score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatient.symptoms.trauma.value)"></tr>

							<tr concept-selector-row ed-triage-patient="edTriagePatient" input-id="'digestive'" concept="edTriagePatientConcept.symptoms.digestive"
								editable="editable"
								sorter="sortAnswer"
								selected-concept="edTriagePatient.symptoms.digestive.value" concept-label="'${ui.message("edtriageapp.digestive")}'"
								score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatient.symptoms.digestive.value)"></tr>

							<tr concept-selector-row ed-triage-patient="edTriagePatient" input-id="'pregnancy'"
								ng-if="edTriagePatient.patient.gender == 'F' && edTriagePatient.patient.ageType == 'A'"
								editable="editable"
								concept="edTriagePatientConcept.symptoms.pregnancy"
								sorter="sortAnswer"
								selected-concept="edTriagePatient.symptoms.pregnancy.value" concept-label="'${ui.message("edtriageapp.pregnancy")}'"
								score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatient.symptoms.pregnancy.value)"></tr>

							<tr concept-selector-row ed-triage-patient="edTriagePatient" input-id="'respiratory'" concept="edTriagePatientConcept.symptoms.respiratory"
								editable="editable"
								sorter="sortAnswer"
								selected-concept="edTriagePatient.symptoms.respiratory.value" concept-label="'${ui.message("edtriageapp.respiratory")}'"
								score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatient.symptoms.respiratory.value)"></tr>

							<tr concept-selector-row ed-triage-patient="edTriagePatient" input-id="'pain'" concept="edTriagePatientConcept.symptoms.pain"
								editable="editable"
								sorter="sortAnswer"
								selected-concept="edTriagePatient.symptoms.pain.value" concept-label="'${ui.message("edtriageapp.pain")}'"
								score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatient.symptoms.pain.value)"></tr>

							<tr concept-selector-row ed-triage-patient="edTriagePatient" input-id="'other'" concept="edTriagePatientConcept.symptoms.other"
								editable="editable"
								sorter="sortAnswer"
								selected-concept="edTriagePatient.symptoms.other.value" concept-label="'${ui.message("edtriageapp.other")}'"
								score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatient.symptoms.other.value)"></tr>
							<tr>
								<td>
									<label>${ui.message("edtriageapp.noSymptomsPresent")}</label>
								</td>
								<td colspan="5">
									<input ng-disabled="!editable" id="confirmNoSymptoms" type="checkbox"
										   ng-model="edTriagePatient.confirmNoSymptoms"/>
								</td>
							</tr>

						</tbody>
					</table>
                </div>
            </div>
        </div>
    </div>

		<div class="row">
			<div class="col-sm-6">
				<div class="panel panel-info">
					<div class="panel-heading">
						<h3 class="panel-title">${ui.message("edtriageapp.addTest")}</h3>
					</div>

					<div class="panel-body ">
						<table class="table table-condensed borderless">
							<thead>
							<tr ng-if="debug">
								<th class="col-xs-4">Large</th>
								<th class="col-xs-4">Small</th>
								<th class="col-xs-1">Small</th>
								<th class="col-xs-1">Small</th>
								<th class="col-xs-1">Small</th>
								<th class="col-xs-1">Small</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td><label>${ui.message("edtriageapp.labs.glucose")}</label></td>

								<td colspan="3">
									<number-only-input input-name="glucose" input-value="edTriagePatient.labs.glucose.value" editable-value="!editable" min-value="1" max-value="999"/>
								</td>
								<td>
									<small>mg/dl</small>
								</td>
								<td>
									<score-display score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatientConcept.labs.glucose.uuid)" score="currentScore.individualScores[edTriagePatientConcept.labs.glucose.uuid]"></score-display>
								</td>
							</tr>
							<tr concept-selector-row ed-triage-patient="edTriagePatient" input-id="'pregnancy_test'"
								ng-if="edTriagePatient.patient.gender == 'F' && edTriagePatient.patient.age > 11"
								editable="editable"
								concept="edTriagePatientConcept.labs.pregnancy_test"
								concept-label="'${ui.message("edtriageapp.labs.pregnancyTest")}'"
								sorter="sortAnswer"
								selected-concept="edTriagePatient.labs.pregnancy_test.value"></tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div class="col-sm-6">
				<div class="panel panel-info">
					<div class="panel-heading">
						<h3 class="panel-title">${ui.message("edtriageapp.immedTreatment")}</h3>
					</div>

					<div class="panel-body ">
						<table class="table table-condensed borderless">
							<thead>
							<tr ng-if="debug">
								<th class="col-xs-4">Large</th>
								<th class="col-xs-4">Small</th>
								<th class="col-xs-1">Small</th>
								<th class="col-xs-1">Small</th>
								<th class="col-xs-1">Small</th>
								<th class="col-xs-1">Small</th>
							</tr>
							</thead>
							<tbody>
							<tr ng-if="edTriagePatient.patient.ageType != 'I'">
								<td><label>${ui.message("edtriageapp.feverInstructions")}</label></td>
								<td colspan="3">
									<label>${ui.message("edtriageapp.paracetamol")}</label>
								</td>
								<td>
									<input ng-disabled="!editable" id="paracetamol" type="checkbox"
										   	ng-model="edTriagePatient.treatment.paracetamol.value"
											ng-true-value="'3cccd4d6-26fe-102b-80cb-0017a47871b2'"/>
								</td>
							</tr>
							<tr ng-if="edTriagePatient.patient.ageType == 'C'">
								<td></td>
								<td colspan="3">
									<label>15 mg/kg</label>
								</td>
								<td>
									<input ng-disabled="!editable" class="form-control" id="paracetamolDose" type="number"
										   ng-model="edTriagePatient.treatment.paracetamolDose.value" />
								</td>
								<td><small>mg</small></td>
							</tr>
							<tr>
								<td><label>${ui.message("edtriageapp.oxygenInstructions")}</label></td>
								<td colspan="3">
									<label>${ui.message("edtriageapp.oxygen")}</label>
								</td>
								<td>
									<input ng-disabled="!editable" id="oxygen" type="checkbox"
										   	ng-model="edTriagePatient.treatment.oxygen.value"
											ng-true-value="'90660681-4b00-469c-b65b-c91afd241c86'"/>
								</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			</div>

		<div class="panel panel-info">
			<div class="panel-heading">
				<h3 class="panel-title">${ ui.message("edtriageapp.clinicalImpression") }</h3>
			</div>
			<div class="panel-body">
				<textarea ng-show="editable" class="form-control" id="impression" rows="3"
						  ng-model="edTriagePatient.clinicalImpression.value"></textarea>
				<span ng-hide="editable">{{ edTriagePatient.clinicalImpression.value }}</span>
			</div>
		</div>

    </form>
	<div class="alert alert-{{message.type}} alert-dismissible fade in" role="alert" ng-show="message.text.length > 0">
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		{{message.text}}
	</div>

    <div class="form-group">
        <div class="col-sm-offset-3 col-sm-3">
            <button type="button" class="btn btn-primary" ng-show="editable" ng-disabled="isSaving || !editable" ng-click="confirmSave()">${ ui.message("edtriageapp.submitButton") }</button>
        </div>
        <div class="col-sm-3" ng-show="isWaitingForConsult() && hasExistingEncounter()">
			<button type="button" class="btn btn-default" ng-disabled="isSaving" ng-click="beginConsult()">${ ui.message("edtriageapp.beginConsult") }</button>
        </div>
        <div class="col-sm-3">
			<button type="button" class="btn btn-default" ng-disabled="isSaving" ng-click="cancel()">${ editable ? ui.message("edtriageapp.exitButton") : ui.message("edtriageapp.backButton") }</button>
        </div>
    </div>
</div>


${ ui.includeFragment("edtriageapp", "translations") }

<script type="text/javascript">
	angular.module('edTriageApp')
			.value('patientUuid', '${ patient.uuid }')
			.value('patientDashboard', '${ dashboardUrl }')
			.value('patientBirthDate', '${ patient.birthdate }')
			.value('patientGender', '${ patient.gender }')
			.value('locationUuid', '${ location.uuid }')
			.value('encounterUuid', '${ encounter ? encounter.uuid : "" }')
			.value('returnUrl', '${ returnUrl ? returnUrl : "" }')
			.value('translations', translations)
			.value('editable', ${ editable })

	jq(function() {
		// make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
		jq(document).on('sessionLocationChanged', function() {
			window.location.reload();
		});
	});

</script>
