import React, { useState, useEffect } from 'react';

const ArtCityTrap = ({ perfectArtUrl }) => {
  const [isTrapped, setIsTrapped] = useState(false);
  const [betterment, setBetterment] = useState(null);

  // 1. Logic for Fetching "Betterment" Data from your Node Server
  useEffect(() => {
    // We define the async function INSIDE the hook to avoid errors
    const fetchMasterData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/betterment');
        if (!response.ok) throw new Error('Failed to fetch from Master Cell');
        const data = await response.json();
        setBetterment(data); 
        console.log("PAIDAI MASTER DATA RECEIVED:", data);
      } catch (error) {
        console.error("Master Cell Connection Failed:", error);
      }
    };

    fetchMasterData();
  }, []); // Run once on mount

  // 2. Logic for Screenshot/Blur Detection
  useEffect(() => {
    const handleBlur = () => {
      setIsTrapped(true);
      console.log("PAIDAI: Snapshot detected, bro. Initiating funny protocol...");
    };

    const handleKeyDown = (e) => {
      // Detect common screenshot keyboard shortcuts
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's'))) {
        setIsTrapped(true);
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Standard cleanup for event listeners

  // 3. Vector Graphic: The AI Mascot
  const AIFunnyClip = () => (
    <svg viewBox="0 0 200 200" className="w-64 h-64">
      <circle cx="100" cy="100" r="80" fill="#111" stroke="#ff0080" strokeWidth="4" />
      <g className="animate-pulse">
        <rect x="70" y="80" width="20" height="5" fill="#ff0080" />
        <rect x="110" y="80" width="20" height="5" fill="#ff0080" />
      </g>
      <path d="M 10,190 Q 100,150 190,190" stroke="#ff0080" fill="none" strokeWidth="2" strokeDasharray="500">
        <animate attributeName="stroke-dashoffset" from="500" to="0" dur="1s" repeatCount="indefinite" />
      </path>
      <text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" fill="#ff0080" fontSize="12" fontWeight="bold">
        PAY THE BREAD, BRO
      </text>
    </svg>
  );

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Betterment Status Bar - Pulls from your Node.js Server */}
      {betterment && (
        <div className="absolute top-0 w-full p-2 bg-pink-900 text-white text-xs text-center uppercase tracking-widest z-10">
          {betterment.id} | STATUS: {betterment.status} | {betterment.message}
        </div>
      )}

      {/* The "Perfect Art" - Hidden when isTrapped is true */}
      <img 
        src={perfectArtUrl} 
        alt="AI Work" 
        className={`w-full h-full object-contain transition-opacity duration-100 ${isTrapped ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* The Trap Layer */}
      {isTrapped && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white text-center p-10 z-50">
          <AIFunnyClip />
          <h2 className="text-2xl font-bold mt-4">Betterment by AI... but not for free.</h2>
          <p className="mt-2 text-pink-500">Pay $1 in SHIB to unlock the full masterpiece.</p>
          <button 
            onClick={() => setIsTrapped(false)} 
            className="mt-6 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded transition-colors"
          >
            I'll Be Honorable (Back to Art)
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtCityTrap;