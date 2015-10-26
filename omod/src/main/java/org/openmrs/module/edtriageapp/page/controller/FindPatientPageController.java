package org.openmrs.module.edtriageapp.page.controller;


import org.openmrs.Location;
import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

public class FindPatientPageController {


    public void controller(UiSessionContext uiSessionContext,
                           PageModel model,
                           @RequestParam("appId") AppDescriptor app
    ) {

        Location sessionLocation = uiSessionContext.getSessionLocation();
        model.addAttribute("appId", app.getId());
    }


}
