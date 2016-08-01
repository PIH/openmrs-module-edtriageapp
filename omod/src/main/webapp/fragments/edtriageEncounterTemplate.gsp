<%
    ui.includeJavascript("coreapps", "fragments/patientdashboard/encountertemplate/defaultEncounterTemplate.js")
%>

<!-- TODO this is a pretty big hack, just used in the old visit view; we can get rid of this when we stop using this view -->

<script type="text/template" id="edtriageEncounterTemplate">
<li>
    <div class="encounter-date">
        <i class="icon-time"></i>
        <strong>
            {{- encounter.encounterTime }}
        </strong>
        {{- encounter.encounterDate }}
    </div>
    <ul class="encounter-details">
        <li>
            <div class="encounter-type">
                <strong>
                    <i class="{{- config.icon }}"></i>
                    <span class="encounter-name" data-encounter-id="{{- encounter.encounterId }}">{{- encounter.encounterType.name }}</span>
                </strong>
            </div>
        </li>
        <li>
            <div>
                ${ ui.message("coreapps.by") }
                <strong class="provider">
                    {{- encounter.primaryProvider ? encounter.primaryProvider : '' }}
                </strong>
                ${ ui.message("coreapps.in") }
                <strong class="location">{{- encounter.location }}</strong>
            </div>
        </li>
        <li>
            <div class="details-action">
                <a href="/${ui.contextPath()}/edtriageapp/edtriageEditPatient.page?patientId={{- patient.id }}&encounterId={{- encounter.encounterId }}&appId=edtriageapp.app.triageQueue&editable=false&returnLabel=${ui.urlEncode('' + patient.formattedName + '')}&returnUrl=${ui.urlEncode('/' + ui.contextPath() + '/coreapps/patientdashboard/patientDashboard.page?patientId=' + patient.id + '&visitId=')}{{- encounter.visitId }}">
                    <span>${ ui.message("coreapps.patientDashBoard.showDetails")}</span>
                    <i class="icon-caret-right"></i>
                </a>
            </div>
        </li>
    </ul>

    <span>
        {{ if ( config.editable && encounter.canEdit) { }}
        <a href="/${ui.contextPath()}/edtriageapp/edtriageEditPatient.page?patientId={{- patient.id }}&encounterId={{- encounter.encounterId }}&appId=edtriageapp.app.triageQueue&editable=true&returnLabel=${ui.urlEncode('' + patient.formattedName + '')}&returnUrl=${ui.urlEncode('/' + ui.contextPath() + '/coreapps/patientdashboard/patientDashboard.page?patientId=' + patient.id + '&visitId=')}{{- encounter.visitId }}">
            <i class="editEncounter delete-item icon-pencil"></i>
        </a>
        {{ } }}
        {{ if ( encounter.canDelete ) { }}
        <i class="deleteEncounterId delete-item icon-remove" data-visit-id="{{- encounter.visitId }}" data-encounter-id="{{- encounter.encounterId }}" title="${ ui.message("coreapps.delete") }"></i>
        {{  } }}
    </span>

</li>
</script>
