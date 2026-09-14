import express from 'express';
import User from '../models/UserModel.js'; // Points cleanly back to your schema file

const router = express.Router();

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
        }).populate('persona_squad');

        // 2. Safely bounce if the identity isn't mapped inside the shadow economy
        if (!userProfile) {
            console.warn(`[BRIDGE WARN] Profile request failed. Handle not registered: "${username}"`);
            return res.status(404).json({ error: `Member profile '${username}' not found inside system directory.` });
        }

        // 3. Pipe out the pristine data packet directly to the UI
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