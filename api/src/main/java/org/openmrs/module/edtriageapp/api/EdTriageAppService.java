/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 * <p>
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 * <p>
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */
package org.openmrs.module.edtriageapp.api;

import org.openmrs.Encounter;
import org.openmrs.Location;
import org.openmrs.Patient;
import org.openmrs.api.OpenmrsService;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * This service exposes module's core functionality. It is a Spring managed bean which is configured in moduleApplicationContext.xml.
 * <p>
 * It can be accessed only via Context:<br>
 * <code>
 * Context.getService(EdTriageAppService.class).someMethod();
 * </code>
 *
 * @see org.openmrs.api.context.Context
 */
@Transactional
public interface EdTriageAppService extends OpenmrsService {

    /**
     * gets the active ED Triage encounters with the past x hours, optionally limited by patient and/or visits at a specific location
     * @param hoursBack - how many hours back to look
     * @param visitLocation- (optional) the visit location, if specified only encounters associated with visits at that location will be returned
     * @param patient - (optional) the patient
     */
    List<Encounter> getActiveEDTriageEncounters(int hoursBack, Location visitLocation, Patient patient);

    /**
     * gets all the ED Triage encounters with the past x hours, optionally limited by patient and/or visits at a specific location
     * @param hoursBack - how many hours back to look
     * @param visitLocation - (optional) the visit location, if specified only encounters associated with visits at that location will be returned
     * @param patient - (optional) the patient
     */
    List<Encounter> getAllEDTriageEncounters(int hoursBack, Location visitLocation, Patient patient);


     /**
     * Get the ED Triage encounter (if any) for the patient's active visit at the specified location
     * (Note that our current functionality only allows for one ED Triage encounter per visit)
     * @param patient
     * @param visitLocation
     */
    Encounter getEDTriageEncounterForActiveVisit(Location visitLocation, Patient patient);
    /*
    * expires ED Triage encounters with a status of "waiting for evaluation" that are part of non-active visits
     */
    void expireEDTriageEncounters();
}