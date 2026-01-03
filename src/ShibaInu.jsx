import React, { useState } from 'react';

const ShibaInu = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="fixed bottom-8 right-8 z-50 transition-all duration-500 ease-in-out"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ transform: isHovered ? 'scale(1.1) translateY(-10px)' : 'scale(1)' }}
        >
            {/* Thought Bubble */}
            {isHovered && (
                <div className="absolute -top-16 right-0 bg-white p-3 rounded-lg shadow-xl border border-indigo-100 text-xs font-bold text-indigo-600 animate-bounce">
                    RAG Brain Active. 32 Files Loaded! 🐕
                </div>
            )}

            {/* Shiba Avatar Circle */}
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer overflow-hidden">
                <span style={{ fontSize: '32px' }}>🐕</span>
            </div>
        </div>
    );
};

export default ShibaInu;