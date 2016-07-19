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
package org.openmrs.module.edtriageapp.api.db.hibernate;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.openmrs.Encounter;
import org.openmrs.Obs;
import org.openmrs.module.edtriageapp.EDTriageConstants;
import org.openmrs.module.edtriageapp.api.db.EdTriageAppDAO;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Set;

/**
 * It is a default implementation of  {@link EdTriageAppDAO}.
 */
public class HibernateEdTriageAppDAO implements EdTriageAppDAO {

    private final Log log = LogFactory.getLog(this.getClass());
    private SessionFactory sessionFactory;

    /**
     * @param sessionFactory the sessionFactory to set
     */
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    /**
     * @return the sessionFactory
     */
    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    /*
    * gets all  encounters at a current location for a patient
    * */
    public List<Encounter> getAllEDTriageEncountersForPatientAtLocation(int hoursBack, String locationUuid, String patientUuid) {

        Criteria criteria = sessionFactory.getCurrentSession().createCriteria(Encounter.class, "enc");

        Calendar now = Calendar.getInstance();
        now.add(Calendar.HOUR, hoursBack * -1);
        criteria.add(Restrictions.ge("enc.encounterDatetime", now.getTime()));
        criteria.add(Restrictions.eq("enc.voided", Boolean.FALSE));

        criteria.createAlias("enc.encounterType", "encType");
        criteria.add(Restrictions.eq("encType.uuid", EDTriageConstants.ED_TRIAGE_ENCOUNTER_TYPE_UUID));

        if (locationUuid != null && locationUuid.length() > 0) {
            criteria.createAlias("enc.location", "loc");
            criteria.add(Restrictions.eq("loc.uuid", locationUuid));
        }

        if (patientUuid != null && patientUuid.length() > 0) {
            criteria.createAlias("enc.patient", "pat");
            criteria.add(Restrictions.eq("pat.uuid", patientUuid));
        }

        criteria.addOrder(Order.desc("enc.encounterDatetime"));

        return criteria.list();
    }

    /**
     * gets all ED Triage encounters that are older than a given number of hours
     *
     * @param hoursBack    - how many hours old
     * @param locationUuid - (optional) the location UUID for the encounters
     * @param patientUuid  - (optional) the patient UUID for the encounters
     * @return
     */
    @Override
    public List<Encounter> getExpiredEncountersForPatientAtLocation(int hoursBack, String locationUuid, String patientUuid) {
        List<Encounter> ret = null;

        Criteria criteria = sessionFactory.getCurrentSession().createCriteria(Encounter.class, "enc");
        //criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);

        Calendar now = Calendar.getInstance();
        now.add(Calendar.HOUR, hoursBack * -1);
        criteria.add(Restrictions.le("enc.encounterDatetime", now.getTime()));
        criteria.add(Restrictions.eq("enc.voided", Boolean.FALSE));

        criteria.createAlias("enc.encounterType", "encType");
        criteria.add(Restrictions.eq("encType.uuid", EDTriageConstants.ED_TRIAGE_ENCOUNTER_TYPE_UUID));

        if (locationUuid != null && locationUuid.length() > 0) {
            criteria.createAlias("enc.location", "loc");
            criteria.add(Restrictions.eq("loc.uuid", locationUuid));
        }

        if (patientUuid != null && patientUuid.length() > 0) {
            criteria.createAlias("enc.patient", "pat");
            criteria.add(Restrictions.eq("pat.uuid", patientUuid));
        }

        criteria.addOrder(Order.desc("enc.encounterDatetime"));

        List<Encounter> temp = criteria.list();
        if (temp != null && temp.size() > 0) {
            ret = new ArrayList<Encounter>();
            for (Encounter enc : temp) {
                Set<Obs> observations = enc.getObs();
                for (Obs obs : observations) {
                    if (EDTriageConstants.TRIAGE_QUEUE_STATUS_CONCEPT_UUID.equals(obs.getConcept().getUuid())
                            && obs.getValueCoded() != null
                            && EDTriageConstants.TRIAGE_QUEUE_WAITING_FOR_EVALUATION_CONCEPT_UUID.equals(obs.getValueCoded().getUuid())) {
                        //this is an active record, so add it to the queue
                        ret.add(enc);
                        log.info(new StringBuilder().append("ADDED encounter for encounter uuid - ").append(enc.getUuid()).toString());
                        break;
                    }

                }
            }
        }
        return ret;
    }
}