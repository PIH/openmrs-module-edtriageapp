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
    public static final String ENCOUNTER_TYPE_UUID = "74cef0a6-2801-11e6-b67b-9e71128cae77";

    /*
     * gets the active encounters for a patient at a location, the location and or the patient are not provided
     *  then the filter will not be applied
     * @param hoursBack - how many hours back to look
     * @param locationUUid - (optional) the location UUID for the encounters
     * @param patientUuid - (optional) the patient UUID for the encounters
     */
    public List<Encounter> getActiveEncountersForPatientAtLocation(int hoursBack, String locationUuid, String patientId);
}