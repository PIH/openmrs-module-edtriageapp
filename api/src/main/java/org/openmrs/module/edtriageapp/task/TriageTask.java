package org.openmrs.module.edtriageapp.task;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.context.Daemon;
import org.openmrs.module.DaemonToken;

import java.util.TimerTask;

/**
 * Generic superclass for ED Triage task
 */

public abstract class TriageTask extends TimerTask {

    Log log = LogFactory.getLog(getClass());
    private static DaemonToken daemonToken;
    private static boolean enabled = false;

    private Class<? extends TriageTask> taskClass;

    public static void setDaemonToken(DaemonToken daemonToken) {
        TriageTask.daemonToken = daemonToken;
    }

    public static void setEnabled(boolean enabled) {
        TriageTask.enabled = enabled;
    }

    public static boolean isEnabled() { return enabled; }

    protected abstract Runnable getRunnableTask();

    @Override
    public final void run() {
        if (daemonToken != null && enabled) {
            createAndRunTask();
        } else {
            log.info("Not running scheduled task. DaemonToken = " + daemonToken + "; enabled = " + enabled);
        }
    }

    /**
     * Construct a new instance of the configured task and execute ot
     */
    public synchronized void createAndRunTask() {
        try {
            log.info("Running ED Triage task: " + getClass().getSimpleName());
            Daemon.runInDaemonThread(getRunnableTask(), daemonToken);
        } catch (Exception e) {
            log.error("An error occured while running scheduled ED Triage task", e);
        }
    }
}
