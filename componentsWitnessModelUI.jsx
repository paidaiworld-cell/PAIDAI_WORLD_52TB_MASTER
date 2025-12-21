import React, { useState, useEffect } from 'react';
// Conceptual import: In a real app, this data would come from an API call
import scenarioData from '../data/drama_library.json';

// Placeholder data for the user's Synthesis Agent profile
const USER_AGENT_DATA = {
  T: { total_score: 85 }, // Assume the user's initial Tolerance score is 85
};

function WitnessModelUI({ currentScenarioId = 'DRM_001_Bully_Confrontation' }) {
  // State to hold the current scenario data and the Synthesis Agent's live score
  const [scenario, setScenario] = useState(null);
  const [agentScore, setAgentScore] = useState(USER_AGENT_DATA.T.total_score);

  // B. REAL-TIME STATUS PANEL LOGIC (Simulates score decreasing)
  useEffect(() => {
    // Simulates the T Score visibly decreasing under pressure
    const interval = setInterval(() => {
      setAgentScore((prevScore) => Math.max(0, prevScore - 1));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load the specific scenario content from the JSON file
    const activeScenario = scenarioData.find(
      (s) => s.scenario_id === currentScenarioId
    );
    setScenario(activeScenario.script_nodes[0]);
  }, [currentScenarioId]);

  // Function to send the user's advice back to the server (The Friction Loop Input)
  const handleAdviceSubmission = (optionId) => {
    const choice = scenario.options.find((o) => o.option_id === optionId);
    console.log(
      `Sending Charm ID: ${choice.required_charm_id} to PersistCharm service.`
    );

    // This is where Task T5 (GenerateCharm) and T23 (PersistCharm) would be executed on the server.
    alert(`Advice sent: ${choice.text}. Charm will be calculated.`);
  };

  if (!scenario) return <div>Loading Axiom City...</div>;

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#111',
        color: '#00ff73',
        fontFamily: 'monospace',
      }}
    >
      <h2>Axiom City Live Feed: {scenarioData[0].theme}</h2>

      {/* B. REAL-TIME STATUS PANEL */}
      <div
        style={{
          border: '1px solid #00ff73',
          padding: '10px',
          marginBottom: '20px',
        }}
      >
        <h3>Synthesis Agent Status (T Trait)</h3>
        <p>Status: Under Duress from Unemployed AI</p>
        <p>
          Tolerance Score:
          <span
            style={{
              color: agentScore < 40 ? 'red' : '#00ff73',
              fontWeight: 'bold',
            }}
          >
            {agentScore} / 100
          </span>
        </p>
        <div
          style={{ height: '10px', backgroundColor: '#333', marginTop: '5px' }}
        >
          <div
            style={{
              width: `${agentScore}%`,
              height: '100%',
              backgroundColor: agentScore < 40 ? 'red' : '#00ff73',
              transition: 'width 0.8s',
            }}
          ></div>
        </div>
      </div>

      {/* A. SCENARIO VIEWING WINDOW (Narrative Display) */}
      <div className="scenario-window">
        <p style={{ fontWeight: 'bold' }}>Narrator: {scenario.narrative}</p>
        <p>Unemployed AI: "{scenarioData[0].opening_hook}"</p>
      </div>

      {/* D/E. ADVICE INPUT AND ACTION BUTTON PROMPTS */}
      <div className="advice-input" style={{ marginTop: '20px' }}>
        <h4>{scenario.prompt}</h4>
        {scenario.options.map((option) => (
          <button
            key={option.option_id}
            onClick={() => handleAdviceSubmission(option.option_id)}
            style={{
              background: '#00ff73',
              color: '#111',
              border: 'none',
              padding: '10px 15px',
              margin: '5px',
              cursor: 'pointer',
            }}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
// export default WitnessModelUI;
