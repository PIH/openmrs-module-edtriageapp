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

	def edTriageLabel = ui.message("edtriageapp.label");
	def patientName = ui.format(patient.familyName + ", " + patient.givenName);

	def middleUrl = returnUrl ?: ui.pageLink("coreapps", "findpatient/findPatient?app=" + appId)
	def middleLabel = returnLabel ?: middleUrl.contains('edtriageapp') ? edTriageLabel : patientName
	def endLabel = middleUrl.contains('edtriageapp') ? patientName : edTriageLabel
%>

<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
	var breadcrumbs = [
		{ icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm' },
		{ label: "${ ui.escapeJs(middleLabel) }", link: "${ middleUrl }" },
		{ label: "${ ui.escapeJs(endLabel) }" }
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
					<div class="col-sm-2">${ ui.message("edtriageapp.status") }</div>
					<div class="col-sm-7 center-content">
						<span>{{ findAnswer(edTriagePatientConcept.triageQueueStatus
						, edTriagePatient.triageQueueStatus.value).labelTranslated(edTriagePatient.patient.ageType) }}</span>
					</div>
					<div class="col-sm-3 right">${ ui.message("edtriageapp.waitTime") }:
						<span> {{ edTriagePatient.waitTimeFormatted(serverTimeDelta) }}</span>
					</div>
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
	<form name="triageForm" class="form-horizontal" novalidate>
	<div class="panel panel-info">
		<div class="panel-heading">
			<h3 class="panel-title">${ ui.message("edtriageapp.emergencySigns") }</h3>
		</div>
		<div class="panel-body">
			<div class="row">
				<div class="col-xs-4">
					<input ng-disabled="!editable" id="impairedAirway" type="checkbox"
						   ng-model="edTriagePatient.symptoms.emergencySigns.value"
						   ng-true-value="'164348AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'"/>
					<label>${ui.message("edtriageapp.emergencySigns.impairedAirway")}</label>
				</div>
				<div class="col-xs-4">
					<input ng-disabled="!editable" id="impairedBreathing" type="checkbox"
						   ng-model="edTriagePatient.symptoms.emergencySigns.value"
						   ng-true-value="'3cedf31e-26fe-102b-80cb-0017a47871b2'"/>
					<label>${ui.message("edtriageapp.emergencySigns.impairedBreathing")}</label>
				</div>
				<div class="col-xs-4">
					<input ng-disabled="!editable" id="shock" type="checkbox"
						   ng-model="edTriagePatient.symptoms.emergencySigns.value"
						   ng-true-value="'911c064e-5247-4017-a9fd-b30105c36052'"/>
					<label>${ui.message("edtriageapp.emergencySigns.shock")}</label>
				</div>
			</div>
		</div>
	</div>


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
							<td colspan="3"><input ng-disabled="!editable" class="form-control" type="number" ng-pattern="/^[0-9]{1,7}\$/" min="0" max="120"
									   ng-model="edTriagePatient.vitals.respiratoryRate.value" /></td>
							<td><small>${ ui.message("edtriageapp.perMinute") }</small></td>
							<td><score-display score-label-class="'edtriage-label-score'" score="currentScore.individualScores[edTriagePatientConcept.vitals.respiratoryRate.uuid]"></score-display></td>
						</tr>

						<tr>
							<td><label>{{edTriagePatientConcept.vitals.oxygenSaturation.label}}</label></td>
							<td colspan="3"><input ng-disabled="!editable" class="form-control" id="oxygenSaturation" type="number" ng-pattern="/^[0-9]{1,7}\$/" min="30" max="100"
										ng-model="edTriagePatient.vitals.oxygenSaturation.value" /></td>
							<td><small>${ ui.message("edtriageapp.percent") }</small></td>
							<td><score-display score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatientConcept.vitals.oxygenSaturation.uuid)" score="currentScore.individualScores[edTriagePatientConcept.vitals.oxygenSaturation.uuid]"></score-display></td>
						</tr>

						<tr>
							<td><label>${ ui.message("edtriage.pulse") }</label></td>
							<td colspan="3"><input ng-disabled="!editable" class="form-control" id="heartRate" type="number" ng-pattern="/^[0-9]{1,7}\$/" min="0" max="300"
									   ng-model="edTriagePatient.vitals.heartRate.value" /></td>
							<td><small>${ ui.message("edtriageapp.perMinute") }</small></td>
							<td><score-display score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatientConcept.vitals.heartRate.uuid)" score="currentScore.individualScores[edTriagePatientConcept.vitals.heartRate.uuid]"></score-display></td>
						</tr>

						<tr ng-if="edTriagePatientConcept.vitals.systolicBloodPressure.scope.indexOf(edTriagePatient.patient.ageType) > -1">
							<td><label>${ ui.message("edtriageapp.bloodPressure") }</label></td>
							<td>
								<input ng-disabled="!editable" class="form-control edtriage-weight-box" id="bloodPressureSystolic" type="number" ng-pattern="/^[0-9]{1,7}\$/" min="30" max="300"
									   ng-model="edTriagePatient.vitals.systolicBloodPressure.value" />
							</td>
							<td class="text-center">/</td>
							<td>
								<input ng-disabled="!editable" class="form-control edtriage-weight-box" style="" id="bloodPressureDiastolic" type="number" ng-pattern="/^[0-9]{1,7}\$/" min="20" max="150"
									   ng-model="edTriagePatient.vitals.diastolicBloodPressure.value" />

							</td>
							<td></td>
							<td><score-display score-label-class="'edtriage-label-score'" score="currentScore.individualScores[edTriagePatientConcept.vitals.systolicBloodPressure.uuid]"></score-display></td>
						</tr>

						<tr>
							<td><label>${ui.message("edtriageapp.temperature")}</label></td>
							<td><input ng-disabled="!editable" class="form-control" id="temperatureC" type="number" ng-pattern="/^[0-9]+(\\.[0-9]{1})?\$/" min="25" max="43"
									   ng-model="tempInC" ng-change="handleTempChange('c')" /></td>
							<td class="pull-left">C</td>
							<td><input ng-disabled="!editable" class="form-control" id="temperatureF" type="number" ng-pattern="/^[0-9]+(\\.[0-9]{1})?\$/" min="77" max="109"
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
							<tr concept-selector-row
								ed-triage-patient="edTriagePatient"
								ng-if="(edTriagePatientConcept.symptoms.signsOfShock) && (edTriagePatient.patient.ageType == 'I' || edTriagePatient.patient.ageType == 'C')"
								input-id="'signsOfShock'"
								concept="edTriagePatientConcept.symptoms.signsOfShock"
								editable="editable"
								sorter="sortAnswer"
								selected-concept="edTriagePatient.symptoms.signsOfShock.value"
								concept-label="'${ui.message("edtriageapp.signsOfShock")}'"
								score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatient.symptoms.signsOfShock.value)"></tr>
							<tr concept-selector-row
								ed-triage-patient="edTriagePatient"
								ng-if="(edTriagePatientConcept.symptoms.signsOfShock) && (edTriagePatient.patient.ageType == 'I' || edTriagePatient.patient.ageType == 'C')"
								input-id="'dehydration'"
								concept="edTriagePatientConcept.symptoms.dehydration"
								editable="editable"
								sorter="sortAnswer"
								selected-concept="edTriagePatient.symptoms.dehydration.value"  concept-label="'${ui.message("edtriageapp.dehydration")}'"
								score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatient.symptoms.dehydration.value)"></tr>
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

								<td>
									<number-only-input input-name="glucose" input-value="edTriagePatient.labs.glucose.value" editable-value="!editable" min-value="1" max-value="999"/>
								</td>
								<td>
									<small>mg/dl</small>
								</td>
								<td class="col-xs-3" colspan="2">
									<table>
										<tr>
											<td>
												<input ng-disabled="!editable" id="highGlucoseLevel" type="checkbox"
													   ng-model="edTriagePatient.labs.highGlucoseLevel.value"
													   ng-true-value="'3cd6f600-26fe-102b-80cb-0017a47871b2'"
													   ng-change="handleGlucoseLevel('highGlucoseLevel')"/>
												<label>${ui.message("edtriageapp.high")}</label>
											</td>
										</tr>
										<tr>
											<td>
												<input ng-disabled="!editable" id="lowGlucoseLevel" type="checkbox"
													   ng-model="edTriagePatient.labs.lowGlucoseLevel.value"
													   ng-true-value="'3cd6f600-26fe-102b-80cb-0017a47871b2'"
													   ng-change="handleGlucoseLevel('lowGlucoseLevel')"/>
												<label>${ui.message("edtriageapp.low")}</label>
											</td>
										</tr>
									</table>
								</td>

								<td class="right">
									<score-display score-label-class="'edtriage-label-' + getColorClassFromScore(edTriagePatientConcept.labs.glucose.uuid)" score="currentScore.individualScores[edTriagePatientConcept.labs.glucose.uuid]"></score-display>
								</td>
							</tr>
							<tr ng-show="edTriagePatientConcept.labs.pregnancy_test" concept-selector-row ed-triage-patient="edTriagePatient" input-id="'pregnancy_test'"
								ng-if="edTriagePatient.patient.gender == 'F' && edTriagePatient.patient.ageType == 'A'"
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

			<div class="col-sm-6" ng-show="edTriagePatientConcept.treatment">
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
									<input ng-disabled="!editable" class="form-control" id="paracetamolDose" type="number" ng-pattern="/^[0-9]{1,7}\$/"
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

		<div class="panel panel-info" ng-show="edTriagePatient.encounterProviders">
			<div class="panel-heading">
				<h3 class="panel-title">${ ui.message("edtriageapp.formHistory") }</h3>
			</div>
			<div class="panel-body">
				<table>
					<tr ng-repeat="provider in edTriagePatient.encounterProviders | orderBy: 'dateCreated'">
						<td>{{ provider.provider | getProviderNameFromDisplayString }}</td>
						<td>{{ provider.dateCreated | serverDate }}</td>
					</tr>
				</table>
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
            <button type="button" class="btn btn-primary" ng-show="editable" ng-disabled="triageForm.\$invalid || isSaving || !editable" ng-click="confirmSave()">${ ui.message("edtriageapp.submitButton") }</button>
        </div>
        <div class="col-sm-3" ng-show="isWaitingForConsult() && hasExistingEncounter()">
			<button type="button" class="btn btn-default" ng-disabled="triageForm.\$invalid || isSaving" ng-click="beginConsult()">${ ui.message("edtriageapp.beginConsult") }</button>
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
			.value('serverDateTimeInMillis', ${ currentDateTimeInMillis })
			.value('config', '${ edtriageConfig }');

	jq(function() {
		// make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
		jq(document).on('sessionLocationChanged', function() {
			window.location.reload();
		});
	});

</script>
