package org.openmrs.module.edtriageapp.page.controller;


import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import org.openmrs.Encounter;
import org.openmrs.Patient;
import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appframework.service.AppFrameworkService;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.module.edtriageapp.EDTriageConstants;
import org.openmrs.module.edtriageapp.EDTriageUtil;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.Redirect;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Iterator;

public class EdtriageEditPatientPageController {

    public Object controller(@RequestParam("patientId") Patient patient, PageModel model,
                             @RequestParam(value = "encounterId", required =  false) Encounter encounter,
                             @SpringBean AppFrameworkService appFrameworkService,
                             @RequestParam(value = "search", required = false) String search,
                             @RequestParam(value = "breadcrumbOverride", required = false) String breadcrumbOverride,
                             @RequestParam(value = "returnUrl", required = false) String returnUrl,
                             @RequestParam(value = "editable", required = false) Boolean editable,
                             @RequestParam(value = "returnLabel", required = false) String returnLabel,
                             UiSessionContext uiSessionContext) {

        if (patient.isVoided() || patient.isPersonVoided()) {
            return new Redirect("coreapps", "patientdashboard/deletedPatient", "patientId=" + patient.getId());
        }

        model.addAttribute("appId", EDTriageConstants.ED_TRIAGE);
        model.addAttribute("search", search);
        model.addAttribute("breadcrumbOverride", breadcrumbOverride);
        model.addAttribute("returnUrl",  returnUrl);
        model.addAttribute("returnLabel",  returnLabel);
        model.addAttribute("locale", uiSessionContext.getLocale());
        model.addAttribute("location", uiSessionContext.getSessionLocation());
        model.addAttribute("patient", patient);
        model.addAttribute("currentDateTimeInMillis", System.currentTimeMillis());

        model.addAttribute("encounter", encounter);
        model.addAttribute("editable", editable != null ? editable : true);

        AppDescriptor app = app = appFrameworkService.getApp(EDTriageConstants.ED_TRIAGE);
        String patientDashboard = null;
        if (app != null) {
            ObjectNode config = app.getConfig();
            JsonNode afterSelectedUrl = config.get("afterSelectedUrl");
            if (afterSelectedUrl != null) {
                String textValue = afterSelectedUrl.getTextValue();
                if (StringUtils.isNotBlank(textValue)) {
                    patientDashboard = EDTriageUtil.parseUrl(textValue, "dashboardUrl");
                }
            }
            Iterator<JsonNode> elements = afterSelectedUrl.getElements();
        }
        model.addAttribute("dashboardUrl", patientDashboard);

        return null;

    }
}
