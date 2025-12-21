import { runTestCoreLoop } from '../test/test_core_loop.js';
import { GloryFilerQueryStatus } from './glory_filer_query_status.js';
import { log } from '../utils/logger.js';

/**
 * @name Task T22: Main service function to execute the scenario and friction loop.
 * This simulates how a user's action impacts their persona traits.
 *
 * @param {string} userId - The ID of the user triggering the scenario.
 * @param {string} scenarioId - The specific scenario being run.
 * @param {string} userAdvice - The response provided by the user.
 * @returns {object} The result of the scenario run, including consequences.
 */
function ScenarioRunner(userId, scenarioId, userAdvice) {
    log.info(`[T22] Running Scenario ID: ${scenarioId} for user: ${userId}`);
    
    // 1. RUN CORE SIMULATION
    // Placeholder for running the core logic which updates the persona traits (A-Z traits).
    const updatedPersona = runTestCoreLoop(userId, scenarioId, userAdvice);

    // 2. SECURITY CHECK
    // T24: Run security checks against the persona's updated traits
    const consequence = GloryFilerQueryStatus(userId, updatedPersona);

    if (consequence === 'TRIGGER_JAIL_PROTOCOL') {
        log.error(`[CONSEQUENCE] JAIL PROTOCOL triggered for user ${userId}.`);
        return {
            action: 'TRIGGER_JAIL_PROTOCOL',
            persona: updatedPersona,
        };
    } else {
        return { 
            status: 'Complete', 
            result: 'Scenario processed successfully.',
            persona: updatedPersona
        };
    }
}

export default ScenarioRunner;