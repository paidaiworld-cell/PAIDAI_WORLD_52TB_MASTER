// services/scenario_runner_service.js

// 1. FINAL CORRECTED IMPORT BLOCK
// services/scenario_runner_service.js

const PersistCharm = require('./persist_charm_service.js'); // Peer path
const GloryFilerQueryStatus = require('./glory_filer_query_status.js'); // Peer path
const RewardMetrics = require('./reward_metrics_service.js'); // Peer path
const GraveyardProtocol = require('./graveyard_protocol_service.js'); // Peer path
const DramaLibrary = require('./data/drama_library.json'); // Correct path to data
// ... (rest of the code)
/**
 * Task T22 (FINAL EDIT): Orchestrates the scenario, runs logic checks, and calls the persistence service.
 * @param {string} userId - ID of the user whose scenario is running.
 * @param {string} scenarioId - The ID of the scenario to run (e.g., 'DRM_001_Bully_Confrontation').
 * @param {string} userAdvice - The final advice from the user (e.g., "Ask for logic").
 * @returns {object} The object containing the updated persona and any final action required.
 */
function ScenarioRunner(userId, scenarioId, userAdvice) {
  console.log(`\n--- Running Scenario: ${scenarioId} for User: ${userId} ---`);

  // 1. Simulating Scenario Initiation Check (The AND Gate Logic)
  const scenario = DramaLibrary.find((s) => s.scenario_id === scenarioId);
  if (!scenario || !scenario.script_nodes[0]) {
    console.error('Scenario content not found.');
    return null;
  }

  // NOTE: This relies on the mock logic in PersistCharm for now.
  const targetTraitId = scenario.target_trait;

  // 2. Perform Logic: Call the Charm Persistence Service (Task T23)
  // The PersistCharm service is called directly with the correct path
  const updatedPersona = PersistCharm(userId, userAdvice, targetTraitId);

  if (updatedPersona) {
    // 3. Security Check (CALLS THE GLORY FILER - Task T24)
    const securityAction = GloryFilerQueryStatus(userId, updatedPersona);

    // 4. Final Reward/Consequence Logic
    if (securityAction === 'TRIGGER_JAIL_PROTOCOL') {
      // If Jail is triggered, we return the immediate action required for the UI.
      return {
        persona: updatedPersona,
        action: securityAction,
        reward_data: null,
      };
    } else {
      // Simulate calling rewards/graveyard based on T23's new Charm (simplified logic)
      const latestCharm =
        updatedPersona.charms[updatedPersona.charms.length - 1];
      let reward_data = null;

      if (latestCharm && latestCharm.is_positive) {
        reward_data = RewardMetrics(userId, latestCharm, 1);
      }

      console.log(
        `Scenario Completed. Final T Score: ${updatedPersona.T.total_score}`
      );
      return {
        persona: updatedPersona,
        action: securityAction,
        reward_data: reward_data,
      };
    }
  }

  return {
    persona: updatedPersona,
    action: 'SCENARIO_FAILED',
    reward_data: null,
  };
}

export default 1$; = ScenarioRunner;
