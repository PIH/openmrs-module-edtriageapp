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
import org.openmrs.Location;
import org.openmrs.Patient;
import org.openmrs.module.edtriageapp.api.EdTriageAppService;

import java.util.List;

/**
 * Database methods for {@link EdTriageAppService}.
 */
public interface EdTriageAppDAO {

    /**
     * gets all the ED Triage encounters with the past x hours, optionally limited by patient and/or visits at a specific location
     * @param hoursBack - how many hours back to look
     * @param visitLocation - (optional) the visit location, if specified only encounters associated with visits at that location will be returned
     * @param patient - (optional) the patient
     */
    List<Encounter> getAllEDTriageEncounters(int hoursBack, Location visitLocation, Patient patient);

   }