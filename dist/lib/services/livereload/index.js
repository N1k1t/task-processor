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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLivereloadServer = exports.livereloadService = void 0;
const tcp_port_used_1 = require("tcp-port-used");
const Console_1 = require("../Console");
const Thread_1 = require("../Thread");
const Server_1 = require("./Server");
const Client_1 = require("./Client");
/*----------  Module deps  ----------*/
const logger = (0, Console_1.buildLogger)('Livereload', 'gray');
/*----------  Exports  ----------*/
var Service_1 = require("./Service");
Object.defineProperty(exports, "livereloadService", { enumerable: true, get: function () { return Service_1.livereloadService; } });
/**
 * @description It starts the livereload server. If it already runs (in another process) that will create the client
 * @return void
 *
 * @param {Object} options 			- Livereload options
 * @param {number} [options.port] 	- Port of livereload server
 *
 * @example
 * ```js
 * import { registerCliTasks, useLivereloadServer } from '@n1k1t/task-processor';
 *
 * useLivereloadServer();
 *
 * registerCliTasks([
 *   {
 *     name: 'page-reload',
 *     use: [
 *       { processor: 'livereload', type: 'reload' }
 *     ]
 *   }
 * ]);
 * ```
*/
exports.useLivereloadServer = (0, Thread_1.useInMainThread)(({ port = 35729 } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const isPortAlreadyUsed = yield (0, tcp_port_used_1.check)(port);
    if (isPortAlreadyUsed) {
        logger.info('There\'s something that uses port'.yellow, String(port).yellow.bold);
        logger.info('Trying to connect as client...'.gray);
        return (0, Client_1.handleClientConnect)(port);
    }
    return (0, Server_1.handleServerConnect)(port);
}));
//# sourceMappingURL=index.js.map