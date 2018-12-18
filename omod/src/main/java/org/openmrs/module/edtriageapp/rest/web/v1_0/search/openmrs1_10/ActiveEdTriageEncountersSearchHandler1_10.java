/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */
package org.openmrs.module.edtriageapp.rest.web.v1_0.search.openmrs1_10;

import org.openmrs.Encounter;
import org.openmrs.api.context.Context;
import org.openmrs.module.edtriageapp.api.EdTriageAppService;
import org.openmrs.module.webservices.rest.web.RequestContext;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.openmrs.module.webservices.rest.web.representation.Representation;
import org.openmrs.module.webservices.rest.web.resource.api.PageableResult;
import org.openmrs.module.webservices.rest.web.resource.api.SearchConfig;
import org.openmrs.module.webservices.rest.web.resource.api.SearchHandler;
import org.openmrs.module.webservices.rest.web.resource.api.SearchQuery;
import org.openmrs.module.webservices.rest.web.resource.impl.NeedsPaging;
import org.openmrs.module.webservices.rest.web.response.ResponseException;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Finds active edtriage encounters
 */
@Component
public class ActiveEdTriageEncountersSearchHandler1_10 implements SearchHandler {

	private static final String REQUEST_PARAM_OVERRIDE_REPRESENTATION= "voveride";
	private static final String REQUEST_PARAM_PATIENT= "patient";
    private static final String REQUEST_PARAM_LOCATION = "location";
    private static final String REQUEST_PARAM_HOURS_BACK = "hours_back";
    private static final int DEFAULT_HOURS_BACK = 48;

	private final SearchQuery searchQuery = new SearchQuery.Builder("Gets Active ED Triage Encounters")
			.withOptionalParameters(REQUEST_PARAM_PATIENT, REQUEST_PARAM_LOCATION, REQUEST_PARAM_HOURS_BACK,REQUEST_PARAM_OVERRIDE_REPRESENTATION).build();


	private final SearchConfig searchConfig = new SearchConfig("getActiveEdTriageEncounters", RestConstants.VERSION_1 + "/encounter",
	        Arrays.asList("1.10.*", "1.11.*", "1.12.*", "2.*"), searchQuery);

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

		boolean useFullRepresentation = toInt(context.getParameter(REQUEST_PARAM_OVERRIDE_REPRESENTATION),0)>0;
		String patient = context.getParameter(REQUEST_PARAM_PATIENT);
		// UHM-3163, show all EDTriage encounters from all locations
		String location = null; //  context.getParameter(REQUEST_PARAM_LOCATION);
		int hoursBack = toInt(context.getParameter(REQUEST_PARAM_HOURS_BACK), DEFAULT_HOURS_BACK);

		List<Encounter> encounters = Context.getService(EdTriageAppService.class).getActiveEDTriageEncounters(hoursBack, location, patient);


		if (useFullRepresentation){
			context.setRepresentation(Representation.FULL); //we want the full representation
		}

		return new NeedsPaging<Encounter>(encounters, context);
	}

    /* helper function to get an int from a string */
	private static int toInt(String n, int defaultVal){
		int ret = defaultVal;
		if(n != null){
			try {
				ret = Integer.parseInt(n);
			} catch (NumberFormatException e) {
				//just use the deafult val
			}
		}
		return ret;
	}
}
