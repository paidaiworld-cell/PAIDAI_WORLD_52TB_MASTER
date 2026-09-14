import React from 'react';
import impactReport from '../../community_impact_report.js';

const CardVeiwer = ({ zoom = 0, activeNode = null }) => {
    // Grabbing the freshly upgraded data payload
    const reportData = impactReport.generateVideoScript();

    // Safely extract our cards array, defaulting to an empty list if not found
    const cardList = reportData.cards || [];

    const getBorderColor = () => {
        if (activeNode === 'MEMBER_01_ARCHITECT') return '#00ffcc'; // Cyber Mint for AIDE
        if (activeNode === 'MEMBER_02_GUIDE') return '#3b82f6';     // Blue for The Guide
        return '#334155'; // Default muted state
    };

    return (
        <div style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px', // Keeps clean spatial separation between cards
            opacity: zoom > 0.2 ? (zoom * 1.2) : 0, // Fades in cleanly as photon approaches
            transform: `translateY(${(1 - zoom) * 50}px)`, // Rises upward during scroll zoom
            transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
            pointerEvents: 'auto'
        }}>

            {/* Renders the top hub layout metadata */}
            <h2 style={{ color: 'white', margin: 0 }}>{reportData.headline}</h2>
            <p style={{ color: '#94a3b8', margin: 0 }}>{reportData.message}</p>

            <hr style={{ border: '1px solid #334155', width: '100%', margin: '8px 0' }} />

            {/* Dynamic mapping engine: loops through your local system tokens */}
            {cardList.length > 0 ? (
                cardList.map((card) => (
                    <div key={card.id} style={{
                        border: `1px solid ${getBorderColor()}`,
                        borderRadius: '12px',
                        padding: '24px',
                        color: 'white',
                        width: '100%',
                        maxWidth: '400px',
                        background: '#1e293b'
                    }}>
                        <h3 style={{ margin: '0 0 8px 0', color: '#00ffcc' }}>{card.title}</h3>
                        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#cbd5e1' }}>{card.content}</p>
                        <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>
                            {card.status}
                        </span>
                    </div>
                ))
            ) : (
                <p style={{ color: '#64748b' }}>Awaiting Hub data...</p>
            )}

        </div>
    );
};

export default CardVeiwer;