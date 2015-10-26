<%
    if (sessionContext.authenticated && !sessionContext.currentProvider) {
        throw new IllegalStateException("Logged-in user is not a Provider")
    }
    ui.decorateWith("appui", "standardEmrPage")

    def baseUrl = ui.pageLink("edtriageapp", "findPatient", [appId: appId])
    def afterSelectedUrl = '/edtriageapp/edtriageSummary.page?patientId={{patientId}}&appId=' + appId

%>
${ ui.includeFragment("uicommons", "validationMessages")}

<script type="text/javascript">

    var breadcrumbs = [
        { icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm' },
        { label: "${ ui.message("edtriageapp.findPatient") }", link: "${ ui.pageLink("edtriageapp", "findPatient") }" }
    ];

    jq(function() {
        jq('#patient-search').focus();
    });

    var selectPatientHandler = {
        handle: function (row, widgetData) {
            var query = widgetData.lastQuery;
            history.replaceState({ query: query }, "", "${baseUrl}&search=" + query);
            location.href = emr.pageLink("edtriageapp", "edtriageSummary", { patientId: row.uuid, appId: '${appId}', search: query });
        }
    }

</script>


<h1>
    ${ ui.message("edtriage.app.label") }
</h1>

${ ui.message("coreapps.searchPatientHeading") }
<div class="container">
    <div id="search-patient-div" class="search-div">
        ${ ui.includeFragment("coreapps", "patientsearch/patientSearchWidget",
                [ afterSelectedUrl: afterSelectedUrl,
                  rowSelectionHandler: "selectPatientHandler",
                  initialSearchFromParameter: "search",
                  showLastViewedPatients: 'false' ])}
    </div>
</div>

<br>
<br>
