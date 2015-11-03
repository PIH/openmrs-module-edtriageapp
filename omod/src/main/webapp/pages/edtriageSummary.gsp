<%
    ui.decorateWith("appui", "standardEmrPage")
    
    ui.includeCss("edtriageapp","edtriageapp.css");
    
%>


<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
    var breadcrumbs = [
        { icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm' },
        { label: "${ ui.message("edtriage.app.label") }", link: "${ ui.pageLink("edtriageapp", "findPatient?app=" + appId) }" },
        { label: "${ ui.escapeJs(ui.format(patient.patient)) }" , link: '${ui.pageLink("coreapps", "patientdashboard/patientDashboard", [patientId: patient.id])}'},
    ];
</script>

${ ui.includeFragment("coreapps", "patientHeader", [ patient: patient ]) }



<!-- Temporary! ED Triage Vitals section -->
<article class="edtriage">

	<!-- Adult, Child, Infant menu selector -->
	<nav class="patientTypeNav">
		<ul>
			<li class="selected">ADULT</li>
			<li>CHILD</li>
			<li>INFANT</li>
		</ul>
	</nav>

	<div style="clear:both;"></div>

	<!-- begin edtriage form-->
	<form id="edtriageForm" name="edtriageForm" action="#">

		<!-- Warning Color -->
		<div class="triageColor">
			<span>Orange</span>
			<div class="orange"></div>
		</div>

		<!-- chief complaint-->
		<section class="chiefComplaint">
			<h2>Chief Complaint</h2>
			<textarea id="chiefComplaint" name="chiefComplaint" placeholder="Type the patient's chief complaint here."></textarea>
		</section>

		<!-- Vitals -->
		<section class="vitals">
			<h2>Vitals</h2>

			<div class="wrapper">

				<section class="formItem">
					<h3>Temperature</h3>
					<input id="temperature" name="temperature" type="text">
					<span class="unitsLabel">F</span>

					<input id="tempUnobtainable" name="tempUnobtainable" type="checkbox">
					<label for="tempUnobtainable">
						Unobtainable
					</label>
				</section>

				<section class="formItem">
					<h3>Heart Rate</h3>
					<input id="heartRate" name="heartRate" type="text">
					<span class="unitsLabel">/ min</span>
				</section>

				<section class="formItem">
					<h3>Blood Pressure</h3>
					<input id="bloodPressureTop" name="bloodPressureTop" type="text">
					<span class="divider">/</span>
					<input id="bloodPressureBottom" name="bloodPressureBottom" type="text">

					<input id="bpUnobtainable" name="bpUnobtainable" type="checkbox">
					<label for="bpUnobtainable">
						Unobtainable
					</label>
				</section>

				<section class="formItem">
					<h3>O2 Saturation</h3>
					<input id="o2Saturation" name="o2Saturation" type="text">
					<span class="unitsLabel">%</span>
				</section>

				<section class="formItem">
					<h3>Respirations</h3>
					<input id="respirations" name="respirations" type="text">
					<span class="unitsLabel">/ min</span>

					<input id="respUnobtainable" name="respUnobtainable" type="checkbox">
					<label for="respUnobtainable">
						Unobtainable
					</label>
				</section>

				<section class="formItem">
					<h3>Glucose</h3>
					<input id="glucose" name="glucose" type="text">
					<span class="unitsLabel">mg/dl</span>

					<input id="glucoseUnobtainable" name="glucoseUnobtainable" type="checkbox">
					<label for="glucoseUnobtainable">
						Unobtainable
					</label>
				</section>

				<section class="formItem">
					<h3>Mobility</h3>

					<input id="mobWalking" name="mobility" type="radio">
					<label for="mobWalking">Walking</label>

					<input id="mobWithHelp" name="mobility" type="radio">
					<label for="mobWithHelp">With Help</label>

					<input id="mobImmobile" name="mobility" type="radio">
					<label for="mobImmobile">Immobile/Stretcher</label>

				</section>

				<section class="formItem">
					<h3>Consciousness</h3>
					<select id="consciousness" name="consciousness">
						<option>Alert</option>
						<option>Reacts to Voice</option>
						<option>Reacts to Pain</option>
						<option>Confused</option>
						<option>Unresponsive</option>
					</select>
				</section>


				<section class="formItem">
					<h3>Trauma</h3>

					<input id="traumaYes" name="trauma" type="radio">
					<label for="traumaYes">Yes</label>

					<input id="traumaNo" name="trauma" type="radio">
					<label for="traumaNo">No</label>

				</section>

				<div id="scoreDiv">
					<span>Score</span>
					<div class="wrapper">
						<span class="number">6</span>
					</div>
				</div>

			</div>

		</section>

		<!-- Symptoms -->
		<section class="symptoms">
			<h2>Symptoms</h2>

			<div class="wrapper">
				<p>TODO</p>
				
			</div>

		</section>

		<div style="clear: both;"></div>

		<!-- Form progress bar-->
		<div class="progressBar">
			<span>Form Completion</span>
			<div class="wrapper">
				<div class="progressIndicator">
					<span class="percent">30%</span>
				</div>
			</div>
		</div>

		<!-- Form Exit -->
		<div class="formExit">
			<input type="submit" name="exit" class="exitForm" 
				value="Exit Form / No Triage (ESC)">
		</div>

		<!-- Form Complete -->
		<div class="formComplete">
			<input type="submit" name="complete" class="completeForm"
				value="Triage Complete (Ctl + Enter)">
		</div>

	</form>


</article>