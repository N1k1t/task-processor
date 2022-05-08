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
exports.handleClientConnect = exports.connectClient = exports.callClientCommand = void 0;
const tcp_port_used_1 = require("tcp-port-used");
const config_1 = __importDefault(require("../../../config"));
const Logger_1 = require("../Logger");
const Service_1 = require("./Service");
const Server_1 = require("./Server");
/*----------  Module deps  ----------*/
const logger = (0, Logger_1.buildLogger)('Livereload', 'gray');
const { wsClient, wsServer } = Service_1.livereloadService;
const handleClientDisconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    const { port } = Service_1.livereloadService;
    const isPortAlreadyUsed = yield (0, tcp_port_used_1.check)(port);
    if (isPortAlreadyUsed) {
        return (0, exports.connectClient)(port);
    }
    logger.info('Can\'t find any servers on'.yellow, String(port).yellow.bold);
    logger.info('Trying to start up server localy...'.gray);
    return new Promise(resolve => {
        wsServer.once('request', () => setTimeout(() => resolve(null), config_1.default.livereloadReconnectDelayMs));
        return (0, Server_1.handleServerConnect)(port);
    });
});
/*----------  Exports  ----------*/
const callClientCommand = (connection) => (command, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!connection.connected) {
        yield handleClientDisconnect();
        return Service_1.livereloadService.callCommand(command, payload);
    }
    connection.sendUTF(JSON.stringify({
        command: 'forward',
        payload: Object.assign({ command }, payload)
    }));
});
exports.callClientCommand = callClientCommand;
const connectClient = (port) => new Promise(resolve => {
    wsClient.once('connect', () => resolve(null));
    wsClient.connect(`ws://localhost:${port}/`);
});
exports.connectClient = connectClient;
const handleClientConnect = (port) => __awaiter(void 0, void 0, void 0, function* () {
    wsClient.on('connect', connection => {
        logger.info('Connected as client'.green);
        Object.assign(Service_1.livereloadService, {
            port,
            using: 'client',
            callCommand: (0, exports.callClientCommand)(connection),
            reloadPage: () => (0, exports.callClientCommand)(connection)('reload', { path: '/' }),
            applyCss: filePath => (0, exports.callClientCommand)(connection)('reload', { path: filePath, liveCSS: true })
        });
    });
    wsClient.on('connectFailed', error => logger.error('Client connect has been failed', error.message));
    return (0, exports.connectClient)(port);
});
exports.handleClientConnect = handleClientConnect;
//# sourceMappingURL=Client.js.map