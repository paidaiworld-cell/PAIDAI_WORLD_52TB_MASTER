import React, { createContext, useState, useContext, useEffect } from 'react';

const SkinContext = createContext();

export const SkinProvider = ({ children }) => {
  // Default skin is 'futuristic'
  const [currentSkin, setCurrentSkin] = useState('futuristic');

  // This effect updates the 'data-skin' attribute on the body tag
  // so your CSS can react to the change globally.
  useEffect(() => {
    document.body.setAttribute('data-skin', currentSkin);
  }, [currentSkin]);

  return (
    <SkinContext.Provider value={{ currentSkin, setCurrentSkin }}>
      {children}
    </SkinContext.Provider>
  );
};

export const useSkin = () => useContext(SkinContext);