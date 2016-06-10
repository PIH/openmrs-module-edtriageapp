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

import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.assertNotNull;

import org.junit.Before;
import org.junit.Test;
import org.openmrs.Encounter;
import org.openmrs.api.context.Context;
import org.openmrs.test.BaseModuleContextSensitiveTest;
import org.openmrs.test.Verifies;

import java.util.List;

/**
 * Tests {@link ${EdTriageAppService}}.
 */
public class EdTriageAppServiceTest extends BaseModuleContextSensitiveTest {

    @Test
    public void shouldSetupContext() {
        assertNotNull(Context.getService(EdTriageAppService.class));
    }

    private EdTriageAppService service;

    private static final int TOTAL_ACTIVE_ENCOUNTERS = 1;
    private static final String TEST_LOCATION = "1111dd4b-0b6d-4481-b979-ccdd38c76cb4";
    private static final String TEST_PATIENT = "e78bc0fe-6370-4766-b46f-8f4c658fe22b";

    @Before
    public void before() throws Exception {
        service = Context.getService(EdTriageAppService.class);
        executeDataSet("EdTriageServiceTest-initialData.xml");
    }

    @Test
    @Verifies(value = "should get active encounters", method = "getActiveEncounters()")
    public void getActiveEncountersAtLocation_shouldGetActiveEncountersAtLocation() throws Exception {
        List<Encounter> list = service.getActiveEncounters(12, TEST_LOCATION, null);
        for (Encounter e : list) {
            System.out.println(e.toString() + " - " + e.getUuid());
            System.out.println("Location uuid = " + e.getLocation().getUuid());
            System.out.println("EncounterType uuid = " + e.getEncounterType().getUuid());
            System.out.println("Observation Count = " + e.getObs().size());
        }
        assertEquals(TOTAL_ACTIVE_ENCOUNTERS, list.size());
    }

    @Test
    @Verifies(value = "should get active encounters for a patient", method = "getActiveEncounters()")
    public void getActiveEncountersAtLocation_shouldGetActiveEncountersAtLocationForPatient() throws Exception {
        List<Encounter> list = service.getActiveEncounters(12, TEST_LOCATION, TEST_PATIENT);
        for (Encounter e : list) {
            System.out.println(e.toString() + " - " + e.getUuid());
            System.out.println("Location uuid = " + e.getLocation().getUuid());
            System.out.println("EncounterType uuid = " + e.getEncounterType().getUuid());
            System.out.println("Observation Count = " + e.getObs().size());
        }
        assertEquals(TOTAL_ACTIVE_ENCOUNTERS, list.size());
    }

}
