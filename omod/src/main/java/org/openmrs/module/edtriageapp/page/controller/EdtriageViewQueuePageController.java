package org.openmrs.module.edtriageapp.page.controller;

import org.openmrs.api.context.Context;
import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.module.edtriageapp.EDTriageConstants;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.Redirect;
import org.springframework.web.bind.annotation.RequestParam;

@SuppressWarnings("unused")
public class EdtriageViewQueuePageController {

    public Object controller(PageModel model,
                             @RequestParam(value = "appId", required = true) AppDescriptor app,
                             @RequestParam(value = "search", required = false) String search,
                             @RequestParam(value = "breadcrumbOverride", required = false) String breadcrumbOverride,
                             UiSessionContext uiSessionContext) {

        if (!Context.hasPrivilege(EDTriageConstants.PRIVILEGE_ED_TRIAGE_QUEUE)) {
            return new Redirect("coreapps", "noAccess", "");
        }

        model.addAttribute("appId", app.getId());
        model.addAttribute("dashboardUrl", app.getConfig().get("dashboardUrl").getTextValue());
        model.addAttribute("search", search);
        model.addAttribute("breadcrumbOverride", breadcrumbOverride);
        model.addAttribute("locale", uiSessionContext.getLocale());
        model.addAttribute("location", uiSessionContext.getSessionLocation());
        model.addAttribute("currentDateTimeInMillis", System.currentTimeMillis());

        return null;
    }

}
