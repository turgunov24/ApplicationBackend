import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';

let wss: WebSocketServer | null = null;

// Map of userId to their WebSocket connections (user can have multiple connections from different devices)
const connectedUsers = new Map<number, Set<WebSocket>>();

interface WebSocketMessage {
	type: string;
	payload?: unknown;
}

interface JwtPayload {
	id: number;
	username: string;
	email: string;
}

export function initializeWebSocket() {
	const wsPort = process.env.WS_PORT || 3006;
	console.log("🚀 ~ initializeWebSocket ~ wsPort:", wsPort)
	const wsServer = http.createServer();
	wss = new WebSocketServer({ server: wsServer });

	wsServer.listen(wsPort, () => {
		logger.info(`WebSocket server is running on port ${wsPort}`);
	});

	wss.on('connection', (ws: WebSocket, req) => {
		logger.info('New WebSocket connection');

		let userId: number | null = null;

		ws.on('message', (message) => {
			try {
				const data = JSON.parse(message.toString()) as WebSocketMessage;
				logger.info(`Received message: ${JSON.stringify(data)}`);

				// Handle authentication message
				if (data.type === 'AUTH' && typeof data.payload === 'string') {
					const token = data.payload;
					const secret = process.env.JWT_SECRET;

					if (secret) {
						try {
							const decoded = jwt.verify(token, secret) as JwtPayload;
							userId = decoded.id;

							// Add this connection to the user's set of connections
							if (!connectedUsers.has(userId)) {
								connectedUsers.set(userId, new Set());
							}
							connectedUsers.get(userId)!.add(ws);

							logger.info(`User ${userId} authenticated via WebSocket`);

							// Send confirmation
							ws.send(
								JSON.stringify({ type: 'AUTH_SUCCESS', payload: { userId } }),
							);
						} catch (error) {
							logger.error('WebSocket authentication failed:', error);
							ws.send(
								JSON.stringify({
									type: 'AUTH_ERROR',
									payload: 'Invalid token',
								}),
							);
						}
					}
				}
			} catch (error) {
				logger.error('Error parsing WebSocket message:', error);
			}
		});

		ws.on('close', () => {
			logger.info('WebSocket connection closed');

			// Remove this connection from the user's set
			if (userId !== null && connectedUsers.has(userId)) {
				const userConnections = connectedUsers.get(userId)!;
				userConnections.delete(ws);

				// If no more connections for this user, remove the entry
				if (userConnections.size === 0) {
					connectedUsers.delete(userId);
				}
			}
		});

		ws.on('error', (error) => {
			logger.error('WebSocket error:', error);
		});
	});

	logger.info('WebSocket server initialized');
}

export function getWebSocketServer() {
	return wss;
}

/**
 * Send a message to a specific user across all their connected devices
 */
export function notifyUser(userId: number, message: WebSocketMessage) {
	const userConnections = connectedUsers.get(userId);

	if (userConnections && userConnections.size > 0) {
		const messageStr = JSON.stringify(message);
		userConnections.forEach((ws) => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(messageStr);
			}
		});
		logger.info(`Notified user ${userId}: ${message.type}`);
		return true;
	}

	logger.info(`User ${userId} not connected, notification not sent`);
	return false;
}

/**
 * Notify a user that their permissions have been updated
 */
export function notifyPermissionUpdate(userId: number) {
	return notifyUser(userId, { type: 'PERMISSION_UPDATE' });
}

/**
 * Notify multiple users about permission updates (e.g., when a role's permissions change)
 */
export function notifyUsersPermissionUpdate(userIds: number[]) {
	userIds.forEach((userId) => notifyPermissionUpdate(userId));
}

/**
 * Get all connected user IDs
 */
export function getConnectedUserIds(): number[] {
	return Array.from(connectedUsers.keys());
}
