import express from 'express';
import User from '../models/UserModel.js';

const router = express.Router();

/**
 * @route   GET /api/user/init/seed
 * @desc    Temporary development route to seed the master profile matching your UI handle
 * @access  Development Internal
 * NOTE: This MUST sit above /:username so Express checks it first!
 */
router.get('/init/seed', async (req, res) => {
    try {
        // 1. Force clear the stale database entry so the new properties can map
        await User.findOneAndDelete({ username: "Steven" });

        // 2. Drop the fresh, complete profile dataset into the vault
        const masterProfile = await User.create({
            username: "Steven",
            global_xp: 450,
            token_balance: 100000,
            pedia_views: 142805,
            paideia_helped: 384
        });

        console.log(`[VAULT] Master identity mapped successfully for handle: "${masterProfile.username}"`);
        return res.status(201).json({
            message: "✅ PAIDAI Master Profile seeded successfully!",
            profile: masterProfile
        });

    } catch (error) {
        console.error(`[VAULT ERROR] Seeding sequence broken: ${error.message}`);
        return res.status(500).json({ error: "Failed to initialize master record.", details: error.message });
    }
});

/**
 * @route   GET /api/user/:username
 * @desc    Fetch a specific member profile containing all 3-pillar ecosystem metrics
 * @access  Public / Authorized Internal Bridge
 */
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // 1. Search MongoDB for the unique handle string case-insensitive
        const userProfile = await User.findOne({
            username: { $regex: new RegExp(`^${username}$`, 'i') }
        });

        if (!userProfile) {
            console.warn(`[BRIDGE WARN] Profile request failed. Handle not registered: "${username}"`);
            return res.status(404).json({ error: `Member profile '${username}' not found inside system directory.` });
        }

        console.log(`[BRIDGE] Serving live profile metrics for member: "${userProfile.username}"`);
        return res.status(200).json(userProfile);

    } catch (error) {
        console.error(`[BRIDGE ERROR] Failed to fetch member dataset: ${error.message}`);
        return res.status(500).json({
            error: "Internal server error reading from data vault.",
            details: error.message
        });
    }
});

export default router;