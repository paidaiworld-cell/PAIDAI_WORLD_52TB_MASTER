import User from '../models/UserModel.js';
import Persona from '../models/PersonaModel.js';

export const executeTrade = async (req, res) => {
    // Add this inside your executeTrade function
const agent = await Persona.findOne({ userId: senderId });

if (agent.level >= 2) {
    const isGreedy = agent.traits.some(t => t.name === 'Greedy');
    
    // If agent is Greedy and offer is low, it REJECTS the trade
    if (isGreedy && amount < 10000) {
        return res.status(403).json({ 
            message: "NEGOTIATION_REFUSED: I am a Level 2 agent with a 'Greedy' trait. This pile of tokens is too small to move my circuits." 
        });
    }
}
    const { senderId, receiverId, amount, personaId } = req.body;

    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        const agent = await Persona.findById(personaId);

        // 1. Level Check
        if (agent.level >= 2) {
            // Level 2 Logic: Check for a "Greedy" trait
            const isGreedy = agent.traits.some(t => t.name === 'Greedy');
            
            if (isGreedy && amount < 1000) {
                return res.status(403).json({ 
                    message: "NEGOTIATION_REFUSED: My 'Greedy' trait is active. This amount is too low for my time." 
                });
            }
        }

        // 2. Standard Math Check (The Level 1 "Dumb" fallback)
        if (sender.token_balance < amount) {
            return res.status(400).json({ message: "BEEP_BOOP: Insufficient funds." });
        }

        // 3. Finalize Trade
        sender.token_balance -= amount;
        receiver.token_balance += amount;
        await sender.save();
        await receiver.save();

        res.status(200).json({
            message: agent.level >= 2 ? "Trade approved after personality check." : "Dumb robot moved the tokens.",
            sender_balance: sender.token_balance
        });

    } catch (error) {
        res.status(500).json({ message: "CRITICAL_ERROR: Trade engine failure." });
    }
};