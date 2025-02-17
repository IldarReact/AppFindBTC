const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class WebSocketServer {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        this.authenticatedClients = new Map();

        this.server = new WebSocket.Server({
            port: 8080,
            verifyClient: this.verifyClient.bind(this)
        });

        this.initialize();
    }

    verifyClient(info, callback) {
        console.log('Новое подключение, заголовки:', info.req.headers);
        callback(true);
    }

    verifyToken(token) {
        try {
            console.log('Проверка токена:', token);
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            console.error('Ошибка проверки токена:', error.message);
            return null;
        }
    }

    initialize() {
        this.server.on('connection', (ws, req) => {
            const userId = req.url.split('/').pop();
            console.log(`Попытка подключения пользователя: ${userId}`);

            let isAuthenticated = false;

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message.toString());

                    if (data.type === 'auth') {
                        const decoded = this.verifyToken(data.token);
                        if (decoded && decoded.userId === userId) {
                            isAuthenticated = true;
                            this.authenticatedClients.set(userId, ws);
                            ws.send(JSON.stringify({
                                type: 'auth',
                                status: 'success'
                            }));
                        } else {
                            ws.send(JSON.stringify({
                                type: 'auth',
                                status: 'error',
                                message: 'Неверный токен'
                            }));
                            ws.close();
                        }
                    }
                } catch (error) {
                    console.error('Ошибка обработки сообщения:', error);
                    console.trace(error); // Вывод стека вызовов
                }
            });

            ws.on('close', () => {
                if (isAuthenticated) {
                    this.authenticatedClients.delete(userId);
                }
            });
        });
    }
}

// Создаем экземпляр сервера
const wsServer = new WebSocketServer();