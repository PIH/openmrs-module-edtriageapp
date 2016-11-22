<div class="dialog-header">
    <h3>${ ui.message("uicommons.confirm") }</h3>
</div>
<div class="dialog-content">
    <p>
        ${ ui.message("edtriageapp.confirmLeftWithoutBeingSeen") }
    </p>
    <br/>
    <div>
        <button class="confirm" ng-click="confirm()">${ ui.message("edtriageapp.leftWithoutBeingSeen") }</button>
        <button class="cancel" ng-click="closeThisDialog()">${ ui.message("uicommons.cancel") }</button>
    </div>
</div>