import React from 'react';
import { useSkin } from '../middleware/SkinContext';


const DropPile = ({ onDropAction }) => {
  const { currentSkin } = useSkin();

  const handleDrop = (e) => {
    e.preventDefault();
    // Trigger the same logical action regardless of skin
    onDropAction();
    
    // Trigger the background flare effect
    const flare = new CustomEvent('bg-flare', { detail: { skin: currentSkin } });
    window.dispatchEvent(flare);
  };

  return (
    <div 
      className={`drop-pile ${currentSkin}-pile`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="pile-label">
        {currentSkin === 'futuristic' ? 'UPLINK DATA' : 'OFFER TO FORGE'}
      </div>
      <div className="pile-animation-core"></div>
    </div>
  );
};