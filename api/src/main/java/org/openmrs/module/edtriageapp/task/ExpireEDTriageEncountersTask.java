package org.openmrs.module.edtriageapp.task;

import org.openmrs.api.context.Context;
import org.openmrs.module.edtriageapp.api.EdTriageAppService;

/**
 * Expire ED Triage encounters with a queue status of "waiting for evaluation"
 */

public class ExpireEDTriageEncountersTask extends TriageTask{

    @Override
    protected Runnable getRunnableTask() {
        return new RunnableTask();
    }

    private class RunnableTask implements Runnable {

        @Override
        public void run() {
            log.warn("ExpireEDTriageEncountersTask runs");
            Context.getService(EdTriageAppService.class).expireEDTriageEncounters();
        }
    }
}
