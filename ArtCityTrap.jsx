import React, { useState, useEffect } from 'react';

const ArtCityTrap = ({ perfectArtUrl }) => {
  const [isTrapped, setIsTrapped] = useState(false);

  const AIFunnyClip = () => (
  <svg viewBox="0 0 200 200" className="w-64 h-64">
    {/* The AI "Face" or Mascot */}
    <circle cx="100" cy="100" r="80" fill="#111" stroke="#ff0080" strokeWidth="4" />
    
    {/* Animated Eyes that "Look" at the user */}
    <g className="animate-pulse">
      <rect x="70" y="80" width="20" height="5" fill="#ff0080" />
      <rect x="110" y="80" width="20" height="5" fill="#ff0080" />
    </g>

    {/* The "Hand" sweeping the screen */}
    <path d="M 10,190 Q 100,150 190,190" stroke="#ff0080" fill="none" strokeWidth="2" strokeDasharray="500">
      <animate 
        attributeName="stroke-dashoffset" 
        from="500" to="0" 
        dur="1s" 
        repeatCount="indefinite" 
      />
    </path>
    
    <text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" fill="#ff0080" fontSize="12" fontWeight="bold">
      PAY THE BREAD, BRO
    </text>
  </svg>
);

const GenerateAIChaos = () => {
  // AI generates a random number of "blocker" shapes
  const shapes = Array.from({ length: 20 }).map((_, i) => (
    <rect
      key={i}
      x={Math.random() * 100 + "%"}
      y={Math.random() * 100 + "%"}
      width={Math.random() * 50 + 20}
      height={Math.random() * 50 + 20}
      fill={`hsl(${Math.random() * 360}, 70%, 50%)`}
      transform={`rotate(${Math.random() * 360})`}
    />
  ));

  return (
    <svg className="absolute inset-0 w-full h-full">
      {shapes}
      <text x="50%" y="50%" textAnchor="middle" fill="white" fontSize="40" fontWeight="bold">
        AI IS WATCHING, BRO 🧿
      </text>
    </svg>
  );
};

  useEffect(() => {
    // 1. Detect when the window loses focus (User opens Snipping Tool/Screenshot app)
    const handleBlur = () => {
      setIsTrapped(true);
      console.log("PAIDAI: Snapshot detected, bro. Initiating funny protocol...");
    };

    // 2. Detect common screenshot keyboard shortcuts
    const handleKeyDown = (e) => {
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
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* The "Perfect Art" - Only visible when not trapped */}
      <img 
        src={perfectArtUrl} 
        alt="AI Work" 
        className={`w-full h-full object-contain transition-opacity duration-100 ${isTrapped ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* The Trap Layer */}
      {isTrapped && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white text-center p-10">
          {/* INSERT YOUR VECTOR ANIMATION HERE */}
          <div className="w-64 h-64 mb-4">
            <svg viewBox="0 0 100 100" className="animate-bounce">
              <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" fill="none" />
              <text x="50" y="55" fontSize="10" textAnchor="middle" fill="white">
                NICE TRY, BRO 😉
              </text>
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Betterment by AI... but not for free.</h2>
          <p className="mt-2">Pay $1 in SHIB to unlock the full masterpiece.</p>
          <button 
            onClick={() => setIsTrapped(false)} 
            className="mt-6 px-4 py-2 bg-white text-black font-bold rounded"
          >
            I'll Be Honorable (Back to Art)
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtCityTrap;