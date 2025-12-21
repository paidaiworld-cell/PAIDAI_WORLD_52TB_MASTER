import mongoose from "mongoose";

// ---Sub-Schema for Traits ---
// Traits are unlocked abilities (e.g., "Cohort Crusher")
const traitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        default: 1,
    },
    type: {
        // e.g., 'Negtiation', 'Contact', 'Data', 'Social'
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});
// ---Main Persona Schema ---
const PersonaSchema = new mongoose.Schema({
    //Link to the user who owns this Persona
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // References the 'User' model once created
        ref: 'User',
    },

    // Core Identity
    name: {
        type: String,
        required: [true, 'Persona must have a unique name.'],
    },
    role: {
        // e.g., 'Mediator', 'Opener', 'Closer', 'Art AI'
        type: String,
        required: [true, 'Persona must have deined role.'],

    },

    // Leveling & Progression
    level: {
        type: Number,
        default: 1,
    },
    xp: {
        type: Number,
        default: 0,
    },

    // AI Definition & Personality
    base_prompt: {
        // The core instructions that define its style ('scaerred from a thousand haggles')
        type: String,
    required: true,
    },

    // Gamification and Specialization
    traits: [traitSchema], //Array of unlocked abilities

    // Battle Scars & Metrics
    stats: {
        deals_won: {
            type: Number,
            default: 0,
        },
        deals_lost: {
            type: Number,
            default: 0,
        },
        avg_gain_usd: {
            type: Number,
            default: 0.00,
        },
    },

    // Economy Tracking
    tokens_burned: {
        type: Number,
        default: 0,
    },

}, {
    // Adds 'createdAt' and 'updatedAt' timestamps automatically
    timestamps: true,
});

const Persona = mongoose.model('Persona', PersonaSchema);

export default Persona;