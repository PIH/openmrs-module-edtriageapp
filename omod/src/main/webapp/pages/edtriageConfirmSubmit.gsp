
<div class="dialog-header">
    <h3>${ ui.message("uicommons.confirm") }</h3>
</div>
<div class="dialog-content">
    <p ng-show="vitalsNotComplete && !deadPatient">
        ${ ui.message("edtriageapp.warning.vitalsNotComplete") }
    </p>
    <p ng-show="noSymptons && !deadPatient">
        ${ ui.message("edtriageapp.warning.noSymptoms") }
    </p>
    <p ng-show="deadPatient">
        ${ ui.message("edtriageapp.warning.deadPatient") }
    </p>
    <p>
        ${ ui.message("edtriageapp.confirmSubmit") }
    </p>
    <br/>
    <div>
        <button class="confirm" ng-click="confirm()">${ ui.message("uicommons.confirm") }</button>
        <button class="cancel" ng-click="closeThisDialog()">${ ui.message("uicommons.cancel") }</button>
    </div>
</div>