// Fix: Convert to modern ES Module syntax
import { persistCharmService } from './persist_charm_service.js';
// Note: Assuming a logger file exists and requires the .js extension fix
// import { log } from '../utils/logger.js'; 

/**
 * Task T32: Calculates and updates user's reward metrics and pioneer status.
 *
 * @param {string} userId - ID of the user.
 * @param {string} rewardTier - The tier of reward earned in the last operation.
 * @returns {string} The user's new Pioneer Status (P-status).
 */
function RewardMetrics(userId, rewardTier) {
    // log.info(`[T32] Calculating metrics for user: ${userId}`); // Log commented out until fixed

    // --- 1. Fetch current metrics (Placeholder) ---
    const currentMetrics = persistCharmService.database[userId];
    if (!currentMetrics) {
        // log.error(`Metrics cannot be calculated: User not found: ${userId}`);
        return 'UNKNOWN';
    }

    // --- 2. Update Reward Score (R-Score) ---
    let rewardUpdate = 0;
    
    switch (rewardTier) {
        case 'PIONEER':
            rewardUpdate = 10;
            break;
        case 'ADVOCATE':
            rewardUpdate = 5;
            break;
        case 'CONTRIBUTOR':
            rewardUpdate = 1;
            break;
        default:
            break;
    }

    currentMetrics.R.total_score += rewardUpdate;
    // log.info(`[T32] R-Score updated by +${rewardUpdate}. New score: ${currentMetrics.R.total_score}`);

    // --- 3. Determine Pioneer Status ---
    let pioneerStatus = 'APPRENTICE';
    if (currentMetrics.R.total_score >= 100) {
        pioneerStatus = 'MASTER PIONEER';
    } else if (currentMetrics.R.total_score >= 50) {
        pioneerStatus = 'PIONEER';
    }

    // log.info(`[T32] User new PIONEER STATUS: ${pioneerStatus}`);

    // --- 4. Persist Changes ---
    persistCharmService.writeCharmData(userId, currentMetrics);

    return pioneerStatus;
}

// Fix: Change module.exports to ESM export syntax
export default RewardMetrics;