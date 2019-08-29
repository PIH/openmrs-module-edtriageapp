package org.openmrs.module.edtriageapp.page.controller;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import org.openmrs.Encounter;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appframework.service.AppFrameworkService;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.module.coreapps.CoreAppsProperties;
import org.openmrs.module.edtriageapp.EDTriageConstants;
import org.openmrs.module.edtriageapp.EDTriageUtil;
import org.openmrs.module.edtriageapp.api.EdTriageAppService;
import org.openmrs.ui.framework.UiUtils;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.Redirect;
import org.springframework.web.bind.annotation.RequestParam;

@SuppressWarnings("unused")
public class EdtriageEditPatientPageController {

	protected Log log = LogFactory.getLog(getClass());

	public Object controller(@RequestParam("patientId") Patient patient, PageModel model,
			@RequestParam(value = "encounterId", required = false) Encounter encounter,
			@SpringBean AppFrameworkService appFrameworkService,
			@SpringBean CoreAppsProperties coreAppsProperties,
			@SpringBean UiUtils uiUtils,
			@RequestParam(value = "search", required = false) String search,
			@RequestParam(value = "breadcrumbOverride", required = false) String breadcrumbOverride,
			@RequestParam(value = "returnUrl", required = false) String returnUrl,
			@RequestParam(value = "editable", required = false) Boolean editable,
			@RequestParam(value = "returnLabel", required = false) String returnLabel,
			UiSessionContext uiSessionContext) {

		if (!Context.hasPrivilege(EDTriageConstants.PRIVILEGE_ED_TRIAGE)) {
			return new Redirect("coreapps", "noAccess", "");
		}

		if (patient.isVoided() || patient.isPersonVoided()) {
			return new Redirect("coreapps", "patientdashboard/deletedPatient", "patientId=" + patient.getId());
		}

		// set the returnUrl to the patient dashboard for the visit if we are coming from a specific encounter
		if (StringUtils.isEmpty(returnUrl) && encounter != null && encounter.getVisit() != null) {
			returnUrl = "/" + uiUtils.contextPath() + "/" + coreAppsProperties.getVisitsPageWithSpecificVisitUrl();
			returnUrl = returnUrl.replace("{{patientId}}", patient.getUuid())
					.replace("{{patient.uuid}}", patient.getUuid())
					.replace("{{visitId}}", encounter.getVisit().getUuid())
					.replace("{{visit.id}}", encounter.getVisit().getUuid());
		}

		// try to get an active ED Triage encounter, if one exists
		// assumes 1 Triage encounter per active visit
		if (encounter == null) {
			encounter = Context.getService(EdTriageAppService.class).getEDTriageEncounterForActiveVisit(patient.getUuid());
		}

		model.addAttribute("appId", EDTriageConstants.ED_TRIAGE);
		model.addAttribute("search", search);
		model.addAttribute("breadcrumbOverride", breadcrumbOverride);
		model.addAttribute("returnUrl", returnUrl);
		model.addAttribute("returnLabel", returnLabel);
		model.addAttribute("locale", uiSessionContext.getLocale());
		model.addAttribute("location", uiSessionContext.getSessionLocation());
		model.addAttribute("patient", patient);
		model.addAttribute("currentDateTimeInMillis", System.currentTimeMillis());

		model.addAttribute("encounter", encounter);
		model.addAttribute("editable", editable != null ? editable : true);

		AppDescriptor app = appFrameworkService.getApp(EDTriageConstants.ED_TRIAGE);
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
		}

		model.addAttribute("dashboardUrl", patientDashboard);

		return null;
	}

}
