"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleServerConnect = void 0;
const http_1 = require("http");
const fs_1 = require("fs");
const url_1 = require("url");
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const Logger_1 = require("../Logger");
const Service_1 = require("./Service");
/*----------  Module deps  ----------*/
const livereloadJsFile = (0, fs_1.readFileSync)(path_1.default.resolve(__dirname, '../../../../assets/livereload.min.js'));
const logger = (0, Logger_1.buildLogger)('Livereload', 'gray');
const { wsServer } = Service_1.livereloadService;
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
const httpServer = (0, http_1.createServer)(httpHandler);
wsServer.mount({ httpServer });
const callServerCommand = (command, payload) => {
    wsServer.connections.forEach(connection => connection.sendUTF(JSON.stringify(Object.assign({ command }, payload))));
};
const webSocketCommandHandlers = {
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
const webSocketMessageHandler = (connection, message) => {
    if (message.type !== 'utf8') {
        return null;
    }
    try {
        const payload = JSON.parse(message.utf8Data);
        const command = payload.command;
        if (webSocketCommandHandlers[command] === undefined) {
            logger.error('WebSocket server can\'t find any resolver for:'.yellow, '\n', message.utf8Data);
            return connection.sendUTF(JSON.stringify({ message: 'Command not found' }));
        }
        webSocketCommandHandlers[command](connection, payload);
    }
    catch (error) {
        logger.error('WebSocket server can\'t resolve message:'.red, '\n', message.utf8Data, '\n', lodash_1.default.get(error, 'message', error) || 'unknown');
    }
};
/*----------  Exports  ----------*/
const handleServerConnect = (port) => {
    Object.assign(Service_1.livereloadService, {
        port,
        using: 'server',
        callCommand: callServerCommand,
        reloadPage: () => callServerCommand('reload', { path: '/' }),
        applyCss: filePath => callServerCommand('reload', { path: filePath, liveCSS: true })
    });
    httpServer.listen(port, () => logger.info('Server has been started on'.green, String(port).green.bold));
    wsServer.on('request', request => {
        const connection = request.accept();
        connection.on('message', message => webSocketMessageHandler(connection, message));
    });
};
exports.handleServerConnect = handleServerConnect;
//# sourceMappingURL=Server.js.map