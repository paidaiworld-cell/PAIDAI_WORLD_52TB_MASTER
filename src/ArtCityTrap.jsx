import React, { useEffect, useState } from 'react';

// LOGIC 1: Search Helper
const queryPAIDAIIndex = async (term) => {
    try {
        const response = await fetch('/rag_index.json');
        const data = await response.json();
        return data.filter(doc => 
            doc.text.toLowerCase().includes(term.toLowerCase()) || 
            doc.source.toLowerCase().includes(term.toLowerCase())
        );
    } catch (e) {
        console.error("Index search failed", e);
        return [];
    }
};

// LOGIC 2: Shiba Guard Definition (Safe Spot)
const ShibaGuard = ({ documentCount }) => (
    <div className="fixed bottom-6 left-6 flex items-center gap-4 bg-gray-800/80 p-4 rounded-2xl border border-orange-500/50 backdrop-blur-md shadow-2xl z-50">
        <div className="text-4xl animate-bounce">🐕</div>
        <div>
            <p className="text-xs font-black text-orange-400 uppercase tracking-tighter">Guard Active</p>
            <p className="text-sm font-bold text-white">{documentCount} Files Indexed</p>
        </div>
    </div>
);

const ArtCityTrap = ({ perfectArtUrl }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [wasmPoints, setWasmPoints] = useState(0);

    // WASM BRIDGE for C++ Engine
    useEffect(() => {
        if (window.Module) {
            const initializeEngine = () => {
                try {
                    const getPointCount = window.Module.cwrap('get_point_count', 'number', []);
                    setWasmPoints(getPointCount());
                } catch (error) {
                    console.error('PAIDAI Engine failed:', error);
                }
            };
            if (window.Module.calledRun) initializeEngine();
            else window.Module.onRuntimeInitialized = initializeEngine;
        }
    }, []);

    return (
        <div className="art-city-trap p-8 bg-gray-900 text-white min-h-screen relative">
            <h1 className="text-2xl font-bold mb-4">PAIDAI WORLD HUB</h1>
            <p className="mb-8 font-mono text-green-400">Engine Points: {wasmPoints}</p>

            {/* SEARCH UI BLOCK */}
            <div className="mb-8 bg-gray-800 p-6 rounded-xl border border-indigo-500/30 shadow-lg">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search the 32 theory documents..."
                        className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    />
                    <button 
                        onClick={async () => setResults(await queryPAIDAIIndex(searchTerm))}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-all"
                    >
                        Search
                    </button>
                </div>

                {results.length > 0 && (
                    <div className="mt-6 space-y-3 max-h-80 overflow-y-auto pr-2">
                        {results.map((res, i) => (
                            <div key={i} className="p-4 bg-gray-900/50 rounded-lg border-l-4 border-indigo-500">
                                <p className="text-xs font-black text-indigo-400 uppercase mb-1">{res.source}</p>
                                <p className="text-sm text-gray-300">{res.text.substring(0, 200)}...</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* THE GUARD IS NOW ACTIVE */}
            <ShibaGuard documentCount={32} />
        </div>
    );
};

export default ArtCityTrap;