
<div class="dialog-header">
    <h3>${ ui.message("uicommons.confirm") }</h3>
</div>
<div class="dialog-content">
    <p ng-show="vitalsNotComplete">
        ${ ui.message("edtriageapp.warning.vitalsNotComplete") }
    </p>
    <p ng-show="noSymptons">
        ${ ui.message("edtriageapp.warning.noSymptoms") }
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