package org.openmrs.module.edtriageapp.page.controller;


import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

public class EdtriageViewQueuePageController {
    public Object controller(PageModel model,
                             @RequestParam(value = "appId", required = true) AppDescriptor app,
                             @RequestParam(value = "search", required = false) String search,
                             @RequestParam(value = "breadcrumbOverride", required = false) String breadcrumbOverride,
                             UiSessionContext uiSessionContext) {

        model.addAttribute("appId", app !=null ? app.getId() : null);
        model.addAttribute("dashboardUrl", app.getConfig().get("dashboardUrl").getTextValue());
        model.addAttribute("search", search);
        model.addAttribute("breadcrumbOverride", breadcrumbOverride);
        model.addAttribute("locale", uiSessionContext.getLocale());
        model.addAttribute("location", uiSessionContext.getSessionLocation());
        model.addAttribute("currentDateTimeInMillis", System.currentTimeMillis());

        return null;

    }
}
