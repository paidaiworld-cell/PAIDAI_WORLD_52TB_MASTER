import User from '../models/UserModel.js';
import Persona from '../models/PersonaModel.js';

// 1. Route to see your AI agents
export const getUserSquad = async (req, res) => {
    try {
        const { userId } = req.params;
        const personas = await Persona.find({ userId });
        if (!personas || personas.length === 0) {
            return res.status(404).json({ message: "No agents found." });
        }
        res.status(200).json(personas);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving squad." });
    }
};

// 2. Your working Registration logic
export const registerUser = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.create({ username, token_balance: 100000, persona_squad: [] });
        const persona = await Persona.create({
            userId: user._id,
            name: `${username}'s Mediator`,
            role: 'Mediator',
            level: 1,
            base_prompt: 'Level 1 Mediator initialized.'
        });
        user.persona_squad.push(persona._id);
        await user.save();
        res.status(201).json({ message: 'User created.', user_id: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed.' });
    }
};