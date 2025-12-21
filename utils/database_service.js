// utils/database_service.js

// NOTE: This structure implements the in-memory mock database for testing purposes.

const dbName = 'Paideia_DB_MOCK';

const MOCK_DB_DATA = {
  // This stores all mock user profiles created during the test

  TEST_USER_A: {
    _id: 'TEST_USER_A',

    R: { total_score: 100, boundary_check: 0.2, investigator_id: 'INVEST_XYZ' },

    T: { total_score: 55, boundary_check: 0.18 },

    charms: [],
  },
};

/**

 * Task T46: Initializes the connection (Mock success).

 * NOTE: This is synchronous (no await) to avoid the mongod error.

 */

function connectDB() {
  console.log(`[DB] Successfully connected to ${dbName}. (MOCK MODE)`);

  return { status: 'MOCK_CONNECTED' };
}

/**

 * Task T43: Retrieves the Synthetic Persona from mock memory.

 * @param {string} userId

 */

async function getPersona(userId) {
  // Simulate async operation for consistency, but retrieve from local memory

  return MOCK_DB_DATA[userId] || null;
}

/**

 * Task T43: Saves the updated Synthetic Persona to mock memory.

 * @param {string} userId

 * @param {object} personaData - The full updated profile.

 */

async function savePersona(userId, personaData) {
  // Update the local mock data (No actual DB write)

  MOCK_DB_DATA[userId] = personaData;

  console.log(`[DB] Persona ${userId} saved/updated. (MOCK MODE)`);
}

export default 1$; = { connectDB, getPersona, savePersona };
