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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openmrs.Encounter;
import org.openmrs.api.context.Context;
import org.openmrs.test.jupiter.BaseModuleContextSensitiveTest;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Tests {@link EdTriageAppService}.
 */
public class EdTriageAppServiceTest extends BaseModuleContextSensitiveTest {

    private static final Log log = LogFactory.getLog(EdTriageAppServiceTest.class);

    @Autowired
    EdTriageAppService edTriageAppService;

    private static final int TOTAL_ALL_ENCOUNTERS = 2;
    private static final int TOTAL_ACTIVE_ENCOUNTERS = 1;
    private static final String TEST_LOCATION = "11111111-0b6d-4481-b979-ccdd38c76cb4";
    private static final String TEST_PATIENT = "da7f524f-27ce-4bb2-86d6-6d1d05312bd5";
    private static final String TEST_ENCOUNTER_DATE = "2016-06-09 12:00:00.0";
    private static final SimpleDateFormat FMT =new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    @BeforeEach
    public void before() throws Exception {
        executeDataSet("EdTriageServiceTest-initialData.xml");
    }

    @Test
    public void shouldSetupContext() {
        assertNotNull(edTriageAppService);
    }

    @Test
    public void getActiveEncountersAtLocation_shouldGetActiveEncountersAtLocation() throws Exception {
        List<Encounter> list = edTriageAppService.getActiveEDTriageEncounters(getHoursBack(), TEST_LOCATION, null);
        printResults(list);
        assertEquals(TOTAL_ACTIVE_ENCOUNTERS, list.size());
    }

    @Test
    public void getActiveEncountersAtLocation_shouldGetActiveEncountersAtLocationForPatient() throws Exception {
        List<Encounter> list = edTriageAppService.getActiveEDTriageEncounters(getHoursBack(), TEST_LOCATION, TEST_PATIENT);
        printResults(list);
        assertEquals(TOTAL_ACTIVE_ENCOUNTERS, list.size());
    }

    @Test
     public void getAllEncountersAtLocation_shouldGetAllEncountersAtLocation() throws Exception {
        List<Encounter> list = edTriageAppService.getAllEDTriageEncounters(getHoursBack(), TEST_LOCATION, null);
        printResults(list);
        assertEquals(TOTAL_ALL_ENCOUNTERS, list.size());
    }

    /* prints results*/
    private static void printResults(List<Encounter> list){
        if(log.isErrorEnabled()){
            StringBuilder ss = new StringBuilder();
            ss.append("Found ").append(list.size()).append(" encounters goes back ").append(getHoursBack())
                    .append(" hours , detail are ->");
            for (Encounter e : list) {
                ss.append("\n Encounter uuid - ").append(e.getUuid());
                ss.append("\n Location uuid - ").append(e.getLocation().getUuid());
                ss.append("\n Patient uuid - ").append(e.getPatient().getUuid());
                ss.append("\n EncounterType uuid - ").append(e.getEncounterType().getUuid());
                ss.append("\n Observation Count - ").append(e.getObs().size());
                ss.append("\n Encounter - ").append(e);
            }
            log.error(ss);
        }
    }

    /* gets the hours back for testing, b/c the test data date is static*/
    private static int getHoursBack(){
        int ret = 0;
        try {
            Date asOf = FMT.parse(TEST_ENCOUNTER_DATE);
            Date now = new Date();
            ret = (int) ((now.getTime()-asOf.getTime())/(60*60 * 1000))+2;
        } catch (ParseException e) {
            //should never happen
        }

        return ret;
    }

}
