"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLivereloadServer = exports.livereloadService = void 0;
const websocket_1 = require("websocket");
const http_1 = require("http");
const tcp_port_used_1 = require("tcp-port-used");
const fs_1 = require("fs");
const url_1 = require("url");
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const Thread_1 = require("./Thread");
const Console_1 = require("./Console");
const httpHandler = ({ url, method }, res) => {
    const { pathname } = (0, url_1.parse)(url || '');
    if (method === 'GET' && pathname === '/livereload.js') {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        return res.end(livereloadJsFile.toString());
    }
    logger.error('HTTP Server can\'t resolve'.yellow, `"${method}" ${pathname}`);
    res.writeHead(404);
    res.end();
};
const logger = (0, Console_1.buildLogger)('Livereload', 'gray');
const httpServer = (0, http_1.createServer)(httpHandler);
const wsServer = new websocket_1.server({ httpServer });
const wsClient = new websocket_1.client();
const livereloadJsFile = (0, fs_1.readFileSync)(path_1.default.resolve(__dirname, '../../../assets/livereload.min.js'));
const webSocketServerCommandHandlers = {
    info: () => { },
    forward: ({}, message) => callServerCommand(message.payload.command, message.payload),
    hello: connection => {
        connection.sendUTF(JSON.stringify({
            serverName: 'n1k1t\'s livereload',
            command: 'hello',
            protocols: [
                'http://livereload.com/protocols/official-7',
                'http://livereload.com/protocols/official-8',
                'http://livereload.com/protocols/official-9',
                'http://livereload.com/protocols/2.x-origin-version-negotiation',
                'http://livereload.com/protocols/2.x-remote-control'
            ]
        }));
    },
};
const webSocketServerMessageHandler = (connection, message) => {
    if (message.type === 'utf8') {
        try {
            const payload = JSON.parse(message.utf8Data);
            const command = payload.command;
            if (webSocketServerCommandHandlers[command] === undefined) {
                logger.error('WebSocket server can\'t find any resolver for:'.yellow, '\n', message.utf8Data);
                return connection.sendUTF(JSON.stringify({ message: 'Command not found' }));
            }
            webSocketServerCommandHandlers[command](connection, payload);
        }
        catch (error) {
            logger.error('WebSocket server can\'t resolve message:'.red, '\n', message.utf8Data, '\n', lodash_1.default.get(error, 'message', error) || 'unknown');
        }
    }
};
const logServerWasNotStarted = () => logger.error('Server wasn\'t started. Call'.red, 'useLivereloadServer'.white.bold, 'in your project first'.red);
const handleClientDisconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    const isPortAlreadyUsed = yield (0, tcp_port_used_1.check)(exports.livereloadService.port);
    if (isPortAlreadyUsed) {
        return connectClient(exports.livereloadService.port);
    }
    return new Promise(resolve => {
        wsServer.once('request', () => setTimeout(() => resolve(null), 1000));
        return handleServerConnect(exports.livereloadService.port);
    });
});
const callServerCommand = (command, payload) => {
    wsServer.connections.forEach(connection => connection.sendUTF(JSON.stringify(Object.assign({ command }, payload))));
    console.log(wsServer.connections.length, exports.livereloadService);
};
const callClientCommand = (connection) => (command, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(exports.livereloadService);
    if (!connection.connected) {
        yield handleClientDisconnect();
        return exports.livereloadService.callCommand(command, payload);
    }
    connection.sendUTF(JSON.stringify({
        command: 'forward',
        payload: Object.assign({ command }, payload)
    }));
});
const connectClient = (port) => new Promise(resolve => {
    wsClient.once('connect', () => resolve(null));
    wsClient.connect(`ws://localhost:${port}/`);
});
const handleClientConnect = (port) => __awaiter(void 0, void 0, void 0, function* () {
    wsClient.on('connect', connection => {
        logger.info('Connected as client'.green);
        Object.assign(exports.livereloadService, {
            port,
            type: 'client',
            callCommand: callClientCommand(connection),
            reloadPage: () => callClientCommand(connection)('reload', { path: '/' }),
            applyCss: filePath => callClientCommand(connection)('reload', { path: filePath, liveCSS: true })
        });
    });
    wsClient.on('connectFailed', error => logger.error('Client connect has been failed', error.message));
    return connectClient(port);
});
const handleServerConnect = (port) => {
    Object.assign(exports.livereloadService, {
        port,
        type: 'server',
        callCommand: callServerCommand,
        reloadPage: () => callServerCommand('reload', { path: '/' }),
        applyCss: filePath => callServerCommand('reload', { path: filePath, liveCSS: true })
    });
    httpServer.listen(port, () => logger.info('Server has been started on'.gray, String(port).green.bold));
    wsServer.on('request', request => {
        const connection = request.accept();
        connection.on('message', message => webSocketServerMessageHandler(connection, message));
    });
};
exports.livereloadService = {
    port: 8080,
    type: 'server',
    callCommand: () => logServerWasNotStarted(),
    reloadPage: () => logServerWasNotStarted(),
    applyCss: () => logServerWasNotStarted()
};
exports.useLivereloadServer = (0, Thread_1.useInMainThread)(({ port = 35729 } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const isPortAlreadyUsed = yield (0, tcp_port_used_1.check)(port);
    if (isPortAlreadyUsed) {
        logger.info('You\'re already have something that uses port'.yellow, String(port).green.bold);
        logger.info('Trying to connect as client...'.gray);
        return handleClientConnect(port);
    }
    return handleServerConnect(port);
}));
//# sourceMappingURL=LivereloadServer.js.map