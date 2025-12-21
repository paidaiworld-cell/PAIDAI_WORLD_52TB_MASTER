import http from 'http';
import express from 'express';
// Correct import: uses named import {} for the function
import { initializeWebSocketServer } from '../services/websocket_service.js'; 
// Correct import: uses default import for the router
import router from './router_final.js';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
// Assuming apiRouter exports the router as default
app.use('/api', apiRouter); 

app.get('/health', (req, res) => {
    res.status(200).send('PAIDAI Microservice Operational');
});

const server = http.createServer(app);

// Initialize the WebSocket Server, passing the HTTP server instance
initializeWebSocketServer(server); 

server.listen(PORT, () => {
    console.log(`PAIDAI Server running on port ${PORT}`);
    console.log('WebSocket server active');
});