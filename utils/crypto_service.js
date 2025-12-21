// utils/database_service.js

const { MongoClient } = require('mongodb'); // Import the MongoDB client

const url = 'mongodb://localhost:27017'; // Connection URL (Localhost example)

const dbName = 'Paideia_DB';

const client = new MongoClient(url);

let dbConnection;

/**

 * Task T46: Initializes the connection to the MongoDB database.

 */

async function connectDB() {
  if (dbConnection) {
    console.log('[DB] Connection already established.');

    return dbConnection;
  }

  try {
    await client.connect();

    dbConnection = client.db(dbName);

    console.log(`[DB] Successfully connected to ${dbName}.`);

    return dbConnection;
  } catch (error) {
    console.error(`[DB] Connection failed: ${error.message}`);

    throw error;
  }
}

/**

 * Task T43: Retrieves the entire Synthetic Persona.

 * @param {string} userId

 * @returns {object|null}

 */

async function getPersona(userId) {
  await connectDB();

  const collection = dbConnection.collection('personas');

  // Finds the document by userId (stored as _id)

  return collection.findOne({ _id: userId });
}

/**

 * Task T43: Saves the updated Synthetic Persona.

 * @param {string} userId

 * @param {object} personaData - The full updated profile.

 */

async function savePersona(userId, personaData) {
  await connectDB();

  const collection = dbConnection.collection('personas');

  // Updates the persona or inserts it if it doesn't exist

  await collection.updateOne(
    { _id: userId },

    { $set: personaData },

    { upsert: true }
  );

  console.log(`[DB] Persona ${userId} saved/updated.`);
}

export default 1$; = { connectDB, getPersona, savePersona };
