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
package org.openmrs.module.edtriageapp;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Concept;
import org.openmrs.ConceptSource;
import org.openmrs.EncounterRole;
import org.openmrs.EncounterType;
import org.openmrs.api.ConceptService;
import org.openmrs.api.EncounterService;
import org.openmrs.api.context.Context;
import org.openmrs.module.BaseModuleActivator;
import org.openmrs.module.ModuleActivator;
import org.openmrs.module.DaemonToken;
import org.openmrs.module.DaemonTokenAware;
import org.openmrs.module.Module;
import org.openmrs.module.ModuleFactory;
import org.openmrs.module.edtriageapp.task.TriageTask;
import org.openmrs.module.emrapi.utils.MetadataUtil;
import org.springframework.transaction.annotation.Transactional;

/**
 * This class contains the logic that is run every time this module is either started or stopped.
 */
@SuppressWarnings("unused")
public class EDTriageAppActivator extends BaseModuleActivator implements DaemonTokenAware {

	protected Log log = LogFactory.getLog(getClass());
	private ConceptService conceptService;
	private EncounterService encounterService;

	/**
	 * @see ModuleActivator#started()
	 */
	@Transactional
	public void started() {
		if (conceptService == null) {
			conceptService = Context.getConceptService();
		}

		if (encounterService == null) {
			encounterService = Context.getEncounterService();
		}

		log.info("Checking and creating metadata for the ED Triage module");
		retireOldConcepts();

		// ensure we have the required concept sources
		addConceptSource("ICD-10-WHO 2nd", EDTriageConstants.ICD_10_WHO_2ND_MAP_UUID,
				"Preferred secondary map to ICD-10-WHO");
		addConceptSource("org.openmrs.module.mirebalaisreports", EDTriageConstants.MIREBALAIS_REPORTS_CONCEPT_SOURCE_UUID,
				"Used to indicate concepts that are used and grouped to represent various notifiable diseases to the Haiti" +
						" Ministry of Health (ie. Tetanus)");

		// ensure we have the required encounter type
		EncounterType edTriageEncounterType = encounterService.getEncounterTypeByUuid(
				EDTriageConstants.ED_TRIAGE_ENCOUNTER_TYPE_UUID);
		if (edTriageEncounterType == null) {
			edTriageEncounterType = new EncounterType();
			edTriageEncounterType.setUuid(EDTriageConstants.ED_TRIAGE_ENCOUNTER_TYPE_UUID);
			edTriageEncounterType.setName("Emergency Triage");
			edTriageEncounterType.setDescription("Emergency Department patient triage");
			encounterService.saveEncounterType(edTriageEncounterType);
		}

		// ensure we have the consulting clinician encounter role
		EncounterRole edTriageEncounterRole = encounterService.getEncounterRoleByUuid(
				EDTriageConstants.CONSULTING_CLINICIAN_ENCOUNTER_ROLE_UUID);
		if (edTriageEncounterRole == null) {
			edTriageEncounterRole = new EncounterRole();
			edTriageEncounterRole.setUuid(EDTriageConstants.CONSULTING_CLINICIAN_ENCOUNTER_ROLE_UUID);
			edTriageEncounterRole.setName("Consulting Clinician");
			edTriageEncounterRole.setDescription(
					"Clinician who is primarily responsible for examining and diagnosing a patient");
			encounterService.saveEncounterRole(edTriageEncounterRole);
		}

		try {
			// Note that this has been specifically setup to run in PEER_TO_PEER mode, meaning that all current
			// mappings will be used
			log.info("Importing ED Triage Metadata");
			MetadataUtil.setupSpecificMetadata(getClass().getClassLoader(), "HUM_Emergency_Triage");
		}
		catch (Exception e) {
			try {
				Module mod = ModuleFactory.getModuleById(EDTriageConstants.ED_TRIAGE_MOD);
				ModuleFactory.stopModule(mod);
			}
			catch (Exception ignored) {}

			throw new RuntimeException("Failed to start the edtriageapp module", e);
		}

		TriageTask.setEnabled(true);
		log.info("ED Triage App Module started");
	}

	private void addConceptSource(String name, String uuid, String description) {
		ConceptSource conceptSource = conceptService.getConceptSourceByName(name);

		if (conceptSource == null) {
			conceptSource = new ConceptSource();
			conceptSource.setUuid(uuid);
			conceptSource.setName(name);
			conceptSource.setDescription(description);
			conceptService.saveConceptSource(conceptSource);
		}
	}

	private void retireOldConcepts() {
		// Retire YES and NO so as to prevent duplicate errors
		Concept yesConcept = conceptService.getConcept(1);
		if (!yesConcept.isRetired()) {
			log.warn("Retiring default YES concept in favor of CIEL:1065");
			conceptService.retireConcept(conceptService.getConcept(1), "Replaced by CIEL:1065");
		}

		Concept noConcept = conceptService.getConcept(2);
		if (!noConcept.isRetired()) {
			log.warn("Retiring default NO concept in favor of CIEL:1066");
			conceptService.retireConcept(conceptService.getConcept(2), "Replaced by CIEL:1066");
		}

		// Adopted from PIH
		// Removed concept "cerebellar infarction” from HUM ED set, and added “cerebral infarction"
		Concept concept = conceptService.getConceptByUuid("145906AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
		if (concept != null) {
			conceptService.retireConcept(concept, "replaced with by 155479AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
		}
	}

	/**
	 * @see ModuleActivator#stopped()
	 */
	public void stopped() {
		log.info("ED Triage App Module stopped");
	}

	@Override
	public void setDaemonToken(DaemonToken daemonToken) {
		TriageTask.setDaemonToken(daemonToken);
	}

	public void setConceptService(ConceptService conceptService) {
		this.conceptService = conceptService;
	}

	public void setEncounterService(EncounterService encounterService) {
		this.encounterService = encounterService;
	}
}
