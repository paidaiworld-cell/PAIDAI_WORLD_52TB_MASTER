import React, { useState, useEffect, useRef } from 'react';
import SpatialInterface from './components/spatial/SpatialInterface';
import './App.css'; // Keeps your global styling intact

function App() {
    const [isInvestigating, setIsInvestigating] = useState(false);
    const [mood, setMood] = useState('neutral');
    const eyeRef = useRef(null);

    // 1. Your 360° Vector Math (Preserved)
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!eyeRef.current || mood === 'victory') return;

            const rect = eyeRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate angle between center and mouse
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            eyeRef.current.style.transform = `rotate(${angle}deg)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mood]);

    // 2. Your Victory Lap Insert (Preserved)
    const triggerVictory = () => {
        setMood('victory');
        setTimeout(() => setMood('neutral'), 600); // Reset after 360 spin
    };

    return (
        <div className="App">
            {/* Launching the Core Spatial Interface Layer and passing your custom vector tracking inside */}
            <SpatialInterface>
                <div className="investigation-zone" style={{ pointerEvents: 'auto' }}>
                    <div className="peach-card-zone" onMouseUp={triggerVictory}>
                        <p style={{ color: '#aaa', fontSize: '0.8rem', margin: 0 }}>Audit Drop Zone (Trigger Victory)</p>
                    </div>

                    <div className="investigation-card" onClick={() => setIsInvestigating(!isInvestigating)}>
                        <div className="community-card">
                            <h2 style={{ margin: '5px 0' }}>THE SINGER</h2>

                            {/* The 360 Vector Eye Layer */}
                            <div
                                ref={eyeRef}
                                className={`vector-eye-layer ${mood === 'victory' ? 'mood-victory-spin' : ''}`}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    margin: '10px auto',
                                    transition: mood === 'victory' ? 'transform 0.6s ease' : 'none'
                                }}
                            />

                            <div className="card-visual">
                                <h1 style={{ margin: '5px 0' }}>$5,000</h1>
                            </div>

                            <div className="hover-summary" style={{ fontSize: '0.8rem', color: '#888' }}>
                                5 emblems, reward, 7 bad reports
                            </div>

                            <button className="hover-action-btn" style={{ marginTop: '10px' }}>Investigate Owner</button>
                        </div>
                    </div>
                </div>
            </SpatialInterface>
        </div>
    );
}

export default App;