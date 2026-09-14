import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Custom DNS override for MongoDB Atlas SRV resolution

import { exec } from 'child_process';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import './models/PersonaModel.js'; // Forces Mongoose to register the Persona schema right at boot!

// 1. Import your Route Maps
import userRoutes from './routes/userRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';

// Forces the environment tool to look explicitly at your local configuration file
dotenv.config({ path: '.env.local' });
const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Basic sanity check route
app.get('/', (req, res) => {
    res.send('PAIDAI Server Running...');
});
app.get('/api/betterment', (req, res) => {
    res.json({
        id: "PAIDAI-52TB-MASTER",
        status: "Logic Active",
        memory_cell: "Connected",
        message: "Node.js Endpoints are now driving PAIDAI WORLD."
    });
});
app.get('/api/search', (req, res) => {
    const queryText = req.query.q;

    if (!queryText) {
        return res.status(400).json({ error: "Query parameter 'q' is missing." });
    }

    console.log(`[BRIDGE] Incoming UI search request: "${queryText}"`);

    // Executes your Python RAG query file with the active search phrase injected
    exec(`python glory_filer_query.py "${queryText}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`[BRIDGE ERROR]: Command failed: python glory_filer_query.py "${queryText}"`);
            console.error(error.message);
            return res.status(500).json({ error: "Failed to execute RAG retrieval loop" });
        }

        try {
            // 1. Find the start of the JSON array bracket inside the terminal output string
            const jsonStartIndex = stdout.lastIndexOf('[');
            if (jsonStartIndex !== -1) {
                const jsonString = stdout.substring(jsonStartIndex);
                const structuredData = JSON.parse(jsonString);

                // 2. Return a pure, interactive JSON payload directly to the browser
                return res.status(200).json(structuredData);
            }

            // Fallback if no JSON array was captured
            res.status(200).json({ raw_terminal_output: stdout });
        } catch (parseError) {
            res.status(500).json({ error: "Failed to parse RAG payload", details: parseError.message });
        }
    });
});

// 4. Use the Routes
app.use('/api/user', userRoutes);
app.use('/api/trade', tradeRoutes);

// 5. Database Connection & Server Start
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        app.listen(PORT, () => console.log(`🔥 PAIDAI Alpha Build running on port ${PORT}`));
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();