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
package org.openmrs.module.edtriageapp.api.impl;

import org.openmrs.Encounter;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.edtriageapp.api.EdTriageAppService;
import org.openmrs.module.edtriageapp.api.db.EdTriageAppDAO;

import java.util.List;

/**
 * It is a default implementation of {@link EdTriageAppService}.
 */
public class EdTriageAppServiceImpl extends BaseOpenmrsService implements EdTriageAppService {

    private EdTriageAppDAO dao;
	
	/**
     * @param dao the dao to set
     */
    public void setDao(EdTriageAppDAO dao) {
	    this.dao = dao;
    }
    
    /**
     * @return the dao
     */
    public EdTriageAppDAO getDao() {
	    return dao;
    }

    @Override
    public List<Encounter> getActiveEncounters(int hoursBack, String locationUuid, String patientUuid) {
        return dao.getActiveEncountersForPatientAtLocation(hoursBack, locationUuid, patientUuid);
    }

    @Override
    public List<Encounter> getAllEncounters(int hoursBack, String locationUuid, String patientUuid){
        return dao.getAllEncountersForPatientAtLocation(hoursBack, locationUuid, patientUuid);
    }

}