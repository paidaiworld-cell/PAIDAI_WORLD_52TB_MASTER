import crypto from 'crypto';
import { persistQRTokenWrite } from './persist_charm_service.js';

const QR_BASE_URL = 'https://paidai.app/scan?token='; // Base URL for the front-end scanner

/**
 * Mints a secure, unique token that represents a physical storyline trigger.
 * The token is stored in the persistence layer along with the associated data.
 *
 * @param {string} userId - The ID of the user creating the QR code.
 * @param {string} storylineId - The ID of the storyline/scenario to be triggered when scanned.
 * @returns {string} The full URL string to be encoded into the physical QR code.
 */
function MintQRCodeToken(userId, storylineId) {
    // 1. Generate a secure, unique ID (UUID or similar, using crypto for strong randomness)
    const token = crypto.randomUUID();

    // 2. Persist the token and its associated metadata
    persistQRTokenWrite(token, userId, storylineId);

    // 3. Return the full URL that the user will scan
    return `${QR_BASE_URL}${token}`;
}

// FIX: Change module.exports to ESM export syntax
export default MintQRCodeToken;