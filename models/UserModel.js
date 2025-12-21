import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'A handle is required to enter the shadow economy.'],
        unique: true,
    },
    global_xp: {
        type: Number,
        default: 0,
    },
    persona_squad: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Persona',
        }
    ],
    token_balance: {
        type: Number,
        default: 100000,
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', UserSchema);

export default User; // This is the 'default export' Node is looking for!