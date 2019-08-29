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

    /*
     * gets the active encounter(s) for a patient at a location
     * @param hoursBack - how many hours back to look
     * @param locationUUid - (optional) the location UUID for the encounters
     * @param patientUuid - (optional) the patient UUID for the encounters
     */
    List<Encounter> getActiveEDTriageEncounters(int hoursBack, String locationUuid, String patientUuid);

     /*
     * gets the all encounters for a patient at a location
     * @param hoursBack - how many hours back to look
     * @param locationUUid - (optional) the location UUID for the encounters
     * @param patientUuid - (optional) the patient UUID for the encounters
     */
    List<Encounter> getAllEDTriageEncounters(int hoursBack, String locationUuid, String patientUuid);


     /*
     * Get the ED Triage encounter (if any) for the patient's active visit
     * (Note that our current functionality only allows for one ED Triage encounter per visit
     * @param patient
     * @param location
     */
    Encounter getEDTriageEncounterForActiveVisit(String locationUuid, String patientUuid);

    /**
     * Get the ED Triage encounter (if any) for the patient's active visit
     * (Note that getEDTriageEncounterForActiveVisit should be preferred if a location is available)
     * @param patientUuid - the uuid for the patient in question
     */
    Encounter getEDTriageEncounterForActiveVisit(String patientUuid);

    /*
    * expires ED Triage encounters with a status of "waiting for evaluation" that are part of non-active visits
     */
    void expireEDTriageEncounters();
}
