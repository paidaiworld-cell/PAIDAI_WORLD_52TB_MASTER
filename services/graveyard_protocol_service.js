import { persistCharmService } from '../utils/logger.js';
import {  } from '../utils/logger.js';

/**
 * Task T33: Initiates the Graveyard Protocol for a user who has triggered a severe consequence (JAIL).
 * This service simulates a complete persona reset and isolation.
 *
 * @param {string} userId - The ID of the user triggering the consequence.
 * @returns {object} The status of the protocol initiation.
 */
function GraveyardProtocol(userId) {
    log.error(`[T33] Initiating GRAVEYARD PROTOCOL for user: ${userId}`);

    // --- 1. Fetch User Data (Pre-Reset Snapshot) ---
    const oldPersona = persistCharmService.database[userId];
    if (!oldPersona) {
        log.error(`User profile not found for Graveyard Protocol: ${userId}`);
        return { success: false, message: "User profile not found." };
    }

    // --- 2. Create New, Neutral Persona (Persona Reset) ---
    const newPersona = {
        T: { total_score: 50, history: [] }, // Reset Tolerance to neutral
        R: { total_score: 0, history: [] },  // Reset Reputation to zero
        // All other traits would be reset to default/neutral values
    };

    // --- 3. Persist Changes (Isolation Simulation) ---
    persistCharmService.writeCharmData(userId, newPersona);

    log.warn(`[T33] User persona reset and isolated. Old R-Score: ${oldPersona.R.total_score}`);
    log.info(`Graveyard Protocol complete. New R-Score: ${newPersona.R.total_score}`);

    return { 
        success: true, 
        message: "Persona wiped and isolated.",
        newReputationScore: newPersona.R.total_score
    };
}

// Fix: Change module.exports to ESM export syntax
export default GraveyardProtocol;