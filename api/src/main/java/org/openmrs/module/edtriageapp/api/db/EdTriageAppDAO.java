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
package org.openmrs.module.edtriageapp.api.db;

import org.openmrs.Encounter;
import org.openmrs.module.edtriageapp.api.EdTriageAppService;

import java.util.List;

/**
 * Database methods for {@link EdTriageAppService}.
 */
public interface EdTriageAppDAO {

    /*
     * gets all the ED Triage encounters for a patient at a location, the location and or the patient are not provided
     *  then the filter will not be applied
     * @param hoursBack - how many hours back to look
     * @param locationUUid - (optional) the location UUID for the encounters
     * @param patientUuid - (optional) the patient UUID for the encounters
     */
    List<Encounter> getAllEDTriageEncountersForPatientAtLocation(int hoursBack, String locationUuid, String patientId);

    /**
     * gets all ED Triage encounters that are older than a given number of hours
     * @param hoursBack - how many hours old
     * @param locationUuid - (optional) the location UUID for the encounters
     * @param patientUuid - (optional) the patient UUID for the encounters
     * @return
     */
    List<Encounter> getExpiredEncountersForPatientAtLocation(int hoursBack, String locationUuid, String patientUuid);
}