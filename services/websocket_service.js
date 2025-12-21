import { WebSocketServer } from 'ws';
import { log } from '../utils/logger.js';
import http from 'http';

let wss;

/**
 * Initializes the WebSocket server and binds it to the HTTP server.
 * @param {http.Server} server - The HTTP server instance to attach to.
 */
export function initializeWebSocketServer(server) {
    wss = new WebSocketServer({ server });

    wss.on('connection', function connection(ws) {
        log.info('WebSocket client connected.');

        ws.on('error', (error) => log.error('WebSocket error:', error));

        ws.on('message', function message(data) {
            log.info(`Received WS message: ${data}`);
            // Broadcast message to all clients
            wss.clients.forEach(function each(client) {
                if (client.readyState === ws.OPEN) {
                    client.send(`Server received: ${data}`);
                }
            });
        });

        ws.on('close', () => {
            log.info('WebSocket client disconnected.');
        });
    });

    log.info('WebSocket server initialized.');
}

// Optional: Function to send data to all connected clients
export function broadcast(data) {
    if (!wss) return;
    wss.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            client.send(data);
        }
    });
}