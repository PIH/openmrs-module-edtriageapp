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

import org.apache.commons.lang3.StringUtils;
import org.openmrs.Concept;
import org.openmrs.Encounter;
import org.openmrs.Location;
import org.openmrs.Obs;
import org.openmrs.Patient;
import org.openmrs.Visit;
import org.openmrs.api.ConceptService;
import org.openmrs.api.EncounterService;
import org.openmrs.api.LocationService;
import org.openmrs.api.ObsService;
import org.openmrs.api.PatientService;
import org.openmrs.api.context.Context;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.edtriageapp.EDTriageConstants;
import org.openmrs.module.edtriageapp.api.EdTriageAppService;
import org.openmrs.module.edtriageapp.api.db.EdTriageAppDAO;
import org.openmrs.module.emrapi.adt.AdtService;
import org.openmrs.module.emrapi.visit.VisitDomainWrapper;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * It is a default implementation of {@link EdTriageAppService}.
 */
@SuppressWarnings("unused")
public class EdTriageAppServiceImpl extends BaseOpenmrsService implements EdTriageAppService {

    private AdtService adtService;

    private PatientService patientService;

    private LocationService locationService;

    private ObsService obsService;

    private ConceptService conceptService;

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

    public AdtService getAdtService() {
        return adtService;
    }

    public void setAdtService(AdtService adtService) {
        this.adtService = adtService;
    }

    public PatientService getPatientService() {
        return patientService;
    }

    public void setPatientService(PatientService patientService) {
        this.patientService = patientService;
    }

    public LocationService getLocationService() {
        return locationService;
    }

    public void setLocationService(LocationService locationService) {
        this.locationService = locationService;
    }

    public ObsService getObsService() {
        return obsService;
    }

    public void setObsService(ObsService obsService) {
        this.obsService = obsService;
    }

    public ConceptService getConceptService() {
        return conceptService;
    }

    public void setConceptService(ConceptService conceptService) {
        this.conceptService = conceptService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Encounter> getActiveEDTriageEncounters(int hoursBack, String locationUuid, String patientUuid) {

        List<Encounter> ret = new ArrayList<Encounter>();
        List<Encounter> temp = getAllEDTriageEncounters(hoursBack, locationUuid, patientUuid);

        for (Encounter enc : temp) {

            // to be active, encounter must belong to an active visit, or no visit
            if (enc.getVisit() == null || enc.getVisit().getStopDatetime() == null) {
                Set<Obs> observations = enc.getObs();
                for (Obs obs : observations) {
                    if (EDTriageConstants.TRIAGE_QUEUE_STATUS_CONCEPT_UUID.equals(obs.getConcept().getUuid())
                            && obs.getValueCoded() != null
                            && EDTriageConstants.TRIAGE_QUEUE_WAITING_FOR_EVALUATION_CONCEPT_UUID.equals(obs.getValueCoded().getUuid())) {
                        //this is an active record, so add it to the queue
                        ret.add(enc);
                        break;
                    }
                }
            }
        }

        return ret;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Encounter> getAllEDTriageEncounters(int hoursBack, String locationUuid, String patientUuid){
        return dao.getAllEDTriageEncountersForPatientAtLocation(hoursBack, locationUuid, patientUuid);
    }

    @Override
    @Transactional(readOnly = true)
    public Encounter getEDTriageEncounterForActiveVisit(String locationUuid, String patientUuid) {

        if (StringUtils.isBlank(locationUuid) || StringUtils.isBlank(patientUuid)) {
            return null;
        }

        Patient patient = patientService.getPatientByUuid(patientUuid);
        Location location = locationService.getLocationByUuid(locationUuid);

        if (patient == null || location == null) {
            return null;
        }

        VisitDomainWrapper visit = adtService.getActiveVisit(patient, location);

        if (visit == null) {
            return null;
        }

        // there should only be one ED Triage encounter per visit, but if there are multiple, this will just return the most recent
        for (Encounter encounter : visit.getSortedEncounters()) {
            if (EDTriageConstants.ED_TRIAGE_ENCOUNTER_TYPE_UUID.equals(encounter.getEncounterType().getUuid())) {
                return encounter;
            }

        }
        return null;
    }

    @Override
    public Encounter getEDTriageEncounterForActiveVisit(String patientUuid) {

        if (StringUtils.isBlank(patientUuid)) {
            return null;
        }

        Patient patient = patientService.getPatientByUuid(patientUuid);

        if (patient == null) {
            return null;
        }

        for (Visit visit : Context.getVisitService().getActiveVisitsByPatient(patient)) {
            for (Encounter encounter : visit.getEncounters()) {
                if (EDTriageConstants.ED_TRIAGE_ENCOUNTER_TYPE_UUID.equals(encounter.getEncounterType().getUuid())) {
                    return encounter;
                }
            }
        }

        return null;
    }

    @Override
    @Transactional
    public void expireEDTriageEncounters() {

        Concept triageQueueStatus = conceptService.getConceptByUuid(EDTriageConstants.TRIAGE_QUEUE_STATUS_CONCEPT_UUID);
        Concept waitingForEvaluation = conceptService.getConceptByUuid(EDTriageConstants.TRIAGE_QUEUE_WAITING_FOR_EVALUATION_CONCEPT_UUID);
        Concept expired = conceptService.getConceptByUuid(EDTriageConstants.TRIAGE_QUEUE_EXPIRED_CONCEPT_UUID);

        List<Obs> waitingForEvaluationObs = obsService.getObservations(null, null, Collections.singletonList(triageQueueStatus),
                Collections.singletonList(waitingForEvaluation), null, null, null, null, null, null, null, false);

        for (Obs obs : waitingForEvaluationObs) {
            // TODO these obs should *always* be associated with a visit, but just in case we check--should probably do something else here as well
            Encounter encounter = obs.getEncounter();
            if (encounter != null && encounter.getVisit() != null) {
                Date stopDatetime = encounter.getVisit().getStopDatetime();
                if (stopDatetime != null) {
                    // the visit was closed therefore set status to EXPIRED for those orphan Triage Obs
                    obs.setValueCoded(expired);
                    obsService.saveObs(obs, "expiring triage queue");
                }
            }
        }
    }

}
