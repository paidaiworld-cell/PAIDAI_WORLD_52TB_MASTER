// test/test_core_loop.js

const { RegisterUser, LoginUser } = require('../services/auth_service'); // T1
const ScenarioRunner = require('../services/scenario_runner_service'); // T22
const { connectDB } = require('../utils/database_service'); // T46

export async function runTestCoreLoop() {
  console.log('--- STARTING CORE MVP TEST ---');

  // 1. Connect to Database
  await connectDB();

  const TEST_USER = 'TEST_USER_A';
  const TEST_PASS = '1234Secure';
  const TEST_PVQ = 'MyFavoriteColorIsNeonGreen';
  const SCENARIO_ID = 'DRM_001_Bully_Confrontation';
  const USER_ADVICE = 'Ask him to define his terms logically.'; // Expected to generate T-26 Charm

  // 2. Task T1: Registration
  console.log('\n[STEP 1] Running Registration...');
  RegisterUser(TEST_USER, TEST_PASS, TEST_PVQ);

  // 3. Task T1: Login Authentication
  console.log('\n[STEP 2] Running Login (Two-Step Auth)...');
  const authResult = await LoginUser(TEST_USER, TEST_PASS, TEST_PVQ);

  if (!authResult) {
    console.error('TEST FAILED: Login failed.');
    return;
  }
  console.log('Login Success. Token:', authResult.sessionToken);

  // 4. Task T22: Run Scenario (The Friction Loop)
  console.log('\n[STEP 3] Running Scenario Runner...');
  const scenarioResult = await ScenarioRunner(
    TEST_USER,
    SCENARIO_ID,
    USER_ADVICE
  );

  if (scenarioResult && scenarioResult.persona) {
    const finalScore = scenarioResult.persona.T.total_score;
    console.log(
      `\n[TEST SUCCESS] Final T-Score: ${finalScore}. Charm generation and persistence complete.`
    );
  } else {
    console.error('TEST FAILED: Scenario did not return valid persona data.');
  }
}

testCoreMVP();
