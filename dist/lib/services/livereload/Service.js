"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.livereloadService = void 0;
const websocket_1 = require("websocket");
const Logger_1 = require("../Logger");
/*----------  Module deps  ----------*/
const logger = (0, Logger_1.buildLogger)('Livereload', 'gray');
const logServerWasNotStarted = () => logger.error('Server wasn\'t started. Call'.red, 'useLivereloadServer'.white.bold, 'function in your project first'.red);
/*----------  Exports  ----------*/
exports.livereloadService = {
    port: 8080,
    using: 'server',
    wsServer: new websocket_1.server(),
    wsClient: new websocket_1.client(),
    callCommand: () => logServerWasNotStarted(),
    reloadPage: () => logServerWasNotStarted(),
    applyCss: () => logServerWasNotStarted()
};
//# sourceMappingURL=Service.js.map