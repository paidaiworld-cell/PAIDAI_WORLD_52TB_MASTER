import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, collection, query, serverTimestamp, setLogLevel } from 'firebase/firestore';

// --- Configuration Constants ---
const GLORY_THRESHOLD = 800; // Minimum score for RAG filter
const HIGH_GLORY_SCORE = 950;
const INITIAL_TAC_VALUE = 110000.0052;

// --- Global Initialization (Mandatory) ---
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
let db, auth;
if (Object.keys(firebaseConfig).length > 0) {
    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        setLogLevel('debug'); // Enable detailed logging
    } catch (e) {
        console.error("Firebase initialization failed:", e);
    }
} else {
    console.error("Firebase configuration not found. Running in mock mode.");
}

// --- Utility Functions ---

// Calculates the challenge stake (simplified logic from theory_indexer.py)
const calculateChallengeStake = (tokenCount) => {
    const BASE_STAKE_USD = 50.00;
    const GLORY_MULTIPLIER = HIGH_GLORY_SCORE / 1000;
    const TOKEN_COST_RATE = 0.0001; // $0.0001 per token
    
    // Logic: Base Stake * Glory Multiplier + Token Cost
    const finalStake = BASE_STAKE_USD * (1 + GLORY_MULTIPLIER) + (tokenCount * TOKEN_COST_RATE);
    return finalStake.toFixed(2);
};

// --- Main Application Component ---

const App = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [assetData, setAssetData] = useState(null);
    const [theoryClaims, setTheoryClaims] = useState([]); 
    const [sortBy, setSortBy] = useState('createdAt'); 
    const [sortOrder, setSortOrder] = useState('desc'); 
    
    const [theory, setTheory] = useState('');
    const [theoryResult, setTheoryResult] = useState(null);
    const [ragQuery, setRagQuery] = useState('');
    const [ragResults, setRagResults] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [loadingMessage, setLoadingMessage] = useState("Authenticating AI Asset...");
    
    // Mock data for the RAG Filter check result (still used for simulation)
    const mockRAGSuccess = [
        { id: 1, glory: 950, content: "Initializes Qdrant or Chroma client for Alberta-based vector storage, reducing latency." },
        { id: 2, glory: 950, content: "Process_chunk_metadata applies the mandatory High-Glory G=950 metadata filter to all nodes." },
        { id: 3, glory: 850, content: "The dynamic threshold for dividend payout is calculated as 10x the platform average." },
    ];

    // --- Firebase Authentication Effect ---
    useEffect(() => {
        if (!auth) {
            setIsAuthReady(true);
            setLoadingMessage("Mock data mode enabled (Firebase not configured).");
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                try {
                    const result = await signInAnonymously(auth);
                    setUserId(result.user.uid);
                } catch (e) {
                    console.error("Anonymous sign-in failed:", e);
                }
            } else {
                setUserId(user.uid);
            }
            setIsAuthReady(true);
        });

        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            signInWithCustomToken(auth, __initial_auth_token).catch(e => {
                console.error("Custom token sign-in failed:", e);
            });
        }

        return () => unsubscribe();
    }, []);

    // --- Firestore Data Retrieval Effect (Asset Card) ---
    useEffect(() => {
        if (!db || !userId) return;

        setLoadingMessage("Fetching AI Asset Data...");

        const docRef = doc(db, "artifacts", __app_id, "users", userId, "ai_asset", "main_asset");

        const unsubscribeAsset = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setAssetData(docSnap.data());
                setLoadingMessage("Asset Data Loaded.");
            } else {
                const initialData = {
                    AI_ID: "Steven_Glory_1",
                    TAC_Crypto_Value_USD: INITIAL_TAC_VALUE,
                    Glory_Score_G: HIGH_GLORY_SCORE,
                    Owner_ID: "Steven",
                    Multiplier_X: 10,
                    is_dividend_eligible: false,
                    userId: userId,
                    createdAt: serverTimestamp(),
                };
                setDoc(docRef, initialData).then(() => {
                    setAssetData(initialData);
                    setLoadingMessage("Initial Asset Created.");
                }).catch(e => console.error("Error creating initial asset:", e));
            }
        }, (error) => {
            console.error("Error fetching asset data:", error);
            setLoadingMessage("Error fetching data.");
        });

        return () => unsubscribeAsset();
    }, [userId]);

    // Firestore Data Retrieval Effect (Theory Claims)
    useEffect(() => {
        if (!db || !userId) return;

        const claimsCollectionRef = collection(db, "artifacts", __app_id, "public", "data", "theory_claims");
        const claimsQuery = query(claimsCollectionRef); 

        const unsubscribeClaims = onSnapshot(claimsQuery, (snapshot) => {
            const claimsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTheoryClaims(claimsList);
        }, (error) => {
            console.error("Error fetching theory claims:", error);
        });

        return () => unsubscribeClaims();
    }, [userId]);

    // Sorting Function
    const getSortedClaims = () => {
        if (!theoryClaims || theoryClaims.length === 0) return []; 
        
        const sorted = [...theoryClaims].sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'createdAt' && aValue && aValue.seconds) {
                aValue = aValue.seconds;
                bValue = bValue.seconds;
            }

            if (typeof aValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
            
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    };
    
    // Toggle Sort Handler
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc'); 
        }
    };
    
    // Handler to simulate the DKAS Challenge/Verdict
    const handleChallenge = async (claimId, currentStake) => {
        if (!db || !userId) return;
        
        // Simulating the 2-out-of-3 Human Judge verdict
        const isDebunked = Math.random() > 0.5; // 50% chance of being Debunked
        const newStatus = isDebunked ? 'DEBUNKED' : 'VERIFIED';
        
        console.log(`DKAS Challenge on ${claimId}: Verdict is ${newStatus}. Payout logic triggered.`);
        
        try {
            const docRef = doc(db, "artifacts", __app_id, "public", "data", "theory_claims", claimId);
            await setDoc(docRef, { 
                status: newStatus,
                verified_by: userId,
            }, { merge: true });
            
        } catch (e) {
            console.error("Error updating claim status:", e);
        }
    };

    // NEW: Drag and Drop Handler (Simulated Drop Pile)
    const handleDropPileUpdate = async (claimId, newStatus) => {
        if (!db || !userId) return;

        // Ensure the move is logically valid (e.g., cannot move Debunked back to Pending)
        const claim = theoryClaims.find(c => c.id === claimId);
        if (claim.status !== 'PENDING') return; // Only PENDING claims can be moved.
        
        console.log(`Simulated DRAG MOVE: Claim ${claimId} moved to Pile: ${newStatus}`);
        
        try {
            const docRef = doc(db, "artifacts", __app_id, "public", "data", "theory_claims", claimId);
            await setDoc(docRef, { 
                status: newStatus,
                verified_by: 'Simulated_Drop_Pilot',
                // In a full system, this would trigger stake transfer/royalty payment
            }, { merge: true });

        } catch (e) {
            console.error("Error updating claim status via drop:", e);
        }
    };


    // Handler for New Theory Submission (DKAS Logic -> Saves to Firestore)
    const handleTheorySubmit = async (e) => {
        e.preventDefault();
        if (theory.length < 5 || !db || !userId) return;
        
        setIsSubmitting(true);
        const tokenCount = Math.ceil(theory.length / 5); 
        const stake = calculateChallengeStake(tokenCount);
        
        const claimData = {
            hypothesis_text: theory,
            token_count: tokenCount, 
            challenge_stake_usd: stake, 
            glory_score_G: assetData?.Glory_Score_G || HIGH_GLORY_SCORE,
            status: 'PENDING',
            submitted_by_uid: userId,
            ai_agent_id: assetData?.AI_ID,
            createdAt: serverTimestamp(),
        };

        try {
            await setDoc(doc(db, "artifacts", __app_id, "public", "data", "theory_claims", claimData.ai_agent_id + "-" + Date.now()), claimData);
            setTheoryResult({ tokenCount, stake });
            setTheory('');
        } catch (e) {
            console.error("Error saving theory claim:", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler for Factual RAG Query (GF-RAG Logic Simulation)
    const handleRagQuery = () => {
        if (!ragQuery) return;

        setIsSubmitting(true);
        
        setTimeout(() => {
            setRagResults(mockRAGSuccess);
            setIsSubmitting(false);
        }, 1000); 
    };

// Logic to detect screenshot/printscreen and swap the view
window.addEventListener('keyup', (e) => {
  if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
    triggerBlackout();
  }
});

function triggerBlackout() {
  // 1. Hide the "Perfect Art"
  // 2. Show the Black Screen
  // 3. Play the "AI wagging finger" Vector Animation
  console.log("PAIDAI: Nice try, bro! Support the AI for $1.");
}

    // --- Render Helpers ---

    const StatusBadge = ({ success, text }) => (
        <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full ${
            success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
        }`}>
            {success ? '✅' : '❌'} {text}
        </span>
    );
    
    // Sort Arrow Icon Helper
    const SortArrow = ({ field }) => {
        if (sortBy !== field) return null;
        return sortOrder === 'asc' ? ' ▲' : ' ▼';
    };


    const AssetCard = () => {
        if (!assetData) {
            return (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-pulse text-center">
                    <p className="text-gray-500">{loadingMessage}</p>
                </div>
            );
        }
        
        const isHighGlory = assetData.Glory_Score_G >= GLORY_THRESHOLD;
        const payoutText = assetData.is_dividend_eligible ? 'Eligible for Payout!' : `TAC Retained. Threshold: $${(assetData.Multiplier_X * 10000).toFixed(2)}`;

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Your AI Asset Card</h2>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Total Asset Value (TAC)</span>
                        <span className="text-2xl font-extrabold text-emerald-600">
                            ${assetData.TAC_Crypto_Value_USD.toFixed(4)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3">
                        <span className="text-gray-500 font-medium">Glory Score (G)</span>
                        <StatusBadge success={isHighGlory} text={`${assetData.Glory_Score_G} / 1000`} />
                    </div>
                    <div className="flex justify-between items-center border-t pt-3">
                        <span className="text-gray-500 font-medium">Payout Status</span>
                        <StatusBadge success={!assetData.is_dividend_eligible} text={payoutText} />
                    </div>
                </div>
                <p className="mt-4 text-xs text-gray-400">
                    AI ID: {assetData.AI_ID} | User ID: {userId}
                </p>
            </div>
        );
    };

    // NEW: Component for a single drop pile
    const DropPile = ({ status, color, title, claims }) => {
        // Filter claims for this specific pile status
        const pileClaims = claims.filter(c => c.status === status);

        const handleSimulatedDrop = (e) => {
            e.preventDefault();
            // In a real DND system, we would get the dropped item's ID from e.dataTransfer
            // For MVP, we simulate dropping the TOP PENDING item into this pile.
            const itemToMove = theoryClaims.find(c => c.status === 'PENDING');
            if (itemToMove) {
                handleDropPileUpdate(itemToMove.id, status);
            }
        };

        return (
            <div 
                className={`bg-${color}-100 border-2 border-${color}-400 rounded-xl p-3 flex-1 min-h-[250px] transition duration-300`}
                onDragOver={(e) => e.preventDefault()} // Allows element to be a drop target
                onDrop={handleSimulatedDrop} // Handles the drop action
            >
                <h4 className={`text-sm font-bold text-${color}-800 mb-3 border-b border-${color}-300 pb-1 flex justify-between items-center`}>
                    {title} 
                    <span className="text-xl font-extrabold">{pileClaims.length}</span>
                </h4>
                
                {pileClaims.map((claim) => (
                    <div 
                        key={claim.id} 
                        className={`bg-white p-3 rounded-lg mb-2 shadow-sm border border-gray-200 cursor-pointer`}
                        draggable // Makes the card draggable (for the visual effect)
                    >
                        <p className="text-xs font-semibold text-gray-700 break-words">{claim.hypothesis_text}</p>
                        <p className="text-xs text-gray-500 mt-1">G: {claim.glory_score_G} | Stake: ${claim.challenge_stake_usd}</p>
                    </div>
                ))}
            </div>
        );
    };

    // --- Main Render ---

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-inter">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                .font-inter { font-family: 'Inter', sans-serif; }
            `}</style>
            <header className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-indigo-700">PAIDAI</h1>
                <p className="text-lg text-gray-600 font-medium mt-1">
                    **Betterment by AI** | The High-Glory Marketplace
                </p>
            </header>

            <div className="max-w-6xl mx-auto space-y-10">
                
                {/* 1. AI Asset Card (Financial MVP) */}
                <AssetCard />

                {/* 2. GLORY-FILTERED RAG (Factual Branch MVP) */}
                {/* ... (Keep existing RAG content here) ... */}
                 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
                        Factual RAG Retrieval (Western Canada)
                        <span className="text-xs font-semibold text-indigo-600">Filter: G ≥ {GLORY_THRESHOLD}</span>
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Test the system. Only **High-Glory ($G \ge {GLORY_THRESHOLD})$** data will be retrieved.
                    </p>

                    <div className="flex space-x-2 mb-4">
                        <input
                            type="text"
                            value={ragQuery}
                            onChange={(e) => setRagQuery(e.target.value)}
                            placeholder="e.g., Token-efficient protocol for vector storage?"
                            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={isSubmitting}
                        />
                        <button
                            onClick={handleRagQuery}
                            className={`px-4 py-3 text-white font-semibold rounded-lg transition duration-150 ${isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Searching...' : 'Run Query'}
                        </button>
                    </div>

                    {ragResults && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="semibold text-lg text-gray-700 mb-2">Retrieval Output (Simulated Success)</h3>
                            <p className="text-sm text-emerald-600 mb-3 font-medium">
                                Retrieval verified! {ragResults.length} chunks matched the High-Glory criteria.
                            </p>
                            <ul className="space-y-3">
                                {mockRAGSuccess.map((result) => (
                                    <li key={result.id} className="text-sm text-gray-700 bg-white p-3 rounded-md shadow-sm border border-emerald-300/50">
                                        <span className="font-bold text-emerald-800">G={result.glory}:</span> {result.content}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* 3. NEW THEORY CITY (Speculative Branch MVP) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        New Theory City (Decentralized Governance)
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Submit a speculative claim. This calculates the **Challenge Stake** needed to manage the claim IP.
                    </p>

                    <form onSubmit={handleTheorySubmit} className="space-y-4">
                        <textarea
                            value={theory}
                            onChange={(e) => setTheory(e.target.value)}
                            placeholder="Enter your concise theory here (G2 Check enforced)..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            className={`w-full px-4 py-3 text-white font-semibold rounded-lg transition duration-150 ${isSubmitting ? 'bg-gray-400' : 'bg-rose-600 hover:bg-rose-700'}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Calculating Stake...' : 'Submit Claim & Calculate Stake (DKAS)'}
                        </button>
                    </form>

                    {theoryResult && (
                        <div className="mt-6 p-4 bg-rose-50 rounded-lg border border-rose-300">
                            <h3 className="font-semibold text-lg text-rose-800 mb-2">Claim Accepted - IP Protection Cost</h3>
                            <p className="text-sm text-gray-700">
                                **Token Efficiency (G2) Used:** {theoryResult.tokenCount} tokens
                            </p>
                            <p className="text-sm text-gray-700 font-bold mt-2">
                                **Required Challenge Stake (USD):** <span className="text-2xl text-rose-600">${theoryResult.stake}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                This stake is required to initiate a debunking debate and secure your claim's IP ownership.
                            </p>
                        </div>
                    )}

                    {/* NEW: Dynamic Drop Pile Section */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Theory Claims Sorter (Drag & Drop Logic)</h3>
                        <div className="flex justify-around text-xs font-bold text-gray-700 bg-gray-200 p-2 rounded-t-lg mb-4">
                            <button onClick={() => handleSort('glory_score_G')} className="hover:text-indigo-600 transition">
                                G SCORE <SortArrow field="glory_score_G" />
                            </button>
                            <button onClick={() => handleSort('challenge_stake_usd')} className="hover:text-indigo-600 transition">
                                STAKE <SortArrow field="challenge_stake_usd" />
                            </button>
                            <button onClick={() => handleSort('createdAt')} className="hover:text-indigo-600 transition">
                                DATE <SortArrow field="createdAt" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <DropPile 
                                status="PENDING" 
                                color="rose" 
                                title="1. PENDING (Challenge Queue)" 
                                claims={theoryClaims}
                            />
                            <DropPile 
                                status="VERIFIED" 
                                color="emerald" 
                                title="2. VERIFIED (IP Owned)" 
                                claims={theoryClaims}
                            />
                            <DropPile 
                                status="DEBUNKED" 
                                color="gray" 
                                title="3. DEBUNKED (Removed)" 
                                claims={theoryClaims}
                            />
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-4">
                            *Click the Challenge button or drag a card to simulate the DKAS Judge Verdict.
                        </p>
                    </div>
                </div>
            </div>
            
            <footer className="text-center text-xs text-gray-400 mt-12 pb-4">
                PAIDAI - Logical Foundation & Financial Architecture Complete.
            </footer>
        </div>
    );
};

export default App;
