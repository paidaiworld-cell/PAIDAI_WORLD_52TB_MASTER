import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


// 1. Import your Route Maps
import userRoutes from './routes/userRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js'; 

dotenv.config();
const app = express();

// 2. Middleware
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
// 4. Use the Routes
app.use('/api/user', userRoutes);
app.use('/api/trade', tradeRoutes); // This connects your trade logic!

// 5. Database Connection & Server Start
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        app.listen(PORT, () => console.log(`🔥 PAIDAI Alpha Build running on port ${PORT}`));
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();