package org.openmrs.module.edtriageapp.rest.web.v1_0.search.openmrs1_10;

import org.openmrs.Encounter;
import org.openmrs.api.context.Context;
import org.openmrs.module.edtriageapp.api.EdTriageAppService;
import org.openmrs.module.webservices.rest.web.RequestContext;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.openmrs.module.webservices.rest.web.resource.api.PageableResult;
import org.openmrs.module.webservices.rest.web.resource.api.SearchConfig;
import org.openmrs.module.webservices.rest.web.resource.api.SearchHandler;
import org.openmrs.module.webservices.rest.web.resource.api.SearchQuery;
import org.openmrs.module.webservices.rest.web.resource.impl.NeedsPaging;
import org.openmrs.module.webservices.rest.web.response.ResponseException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

@Component
public class EdTriageEncounterForActiveVisitSearchHandler1_10  implements SearchHandler {

    private static final String REQUEST_PARAM_PATIENT= "patient";
    private static final String REQUEST_PARAM_LOCATION = "location";

    private final SearchQuery searchQuery = new SearchQuery.Builder("Gets the ED Triage Encounter associated with a Patient's active visit")
            .withRequiredParameters(REQUEST_PARAM_PATIENT, REQUEST_PARAM_LOCATION).build();


    private final SearchConfig searchConfig = new SearchConfig("getEDTriageEncounterForActiveVisit", RestConstants.VERSION_1 + "/encounter",
            Arrays.asList("1.10.*", "1.11.*", "1.12.*", "2.0.*"), searchQuery);

    /**
     * @see SearchHandler#getSearchConfig()
     */
    @Override
    public SearchConfig getSearchConfig() {
        return searchConfig;
    }

    /**
     * @see SearchHandler#search(RequestContext)
     */
    @Override
    public PageableResult search(RequestContext context) throws ResponseException {
        String patient = context.getParameter(REQUEST_PARAM_PATIENT);
        String location = context.getParameter(REQUEST_PARAM_LOCATION);
        Encounter encounter = Context.getService(EdTriageAppService.class).getEDTriageEncounterForActiveVisit(location, patient);
        return new NeedsPaging<Encounter>(encounter != null ? Collections.singletonList(encounter) : new ArrayList<Encounter>(), context);
    }



}
