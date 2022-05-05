"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTaskWatcher = void 0;
const chokidar_1 = require("chokidar");
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const Console_1 = require("./Console");
const config_1 = __importDefault(require("../../config"));
/*----------  Module deps  ----------*/
const logger = (0, Console_1.buildLogger)('Watcher', 'magenta');
/*----------  Exports  ----------*/
const setupTaskWatcher = (task, handler) => {
    const watchMatches = lodash_1.default.get(task.watch, 'match', task.watch);
    const ignoreList = lodash_1.default.flatten([lodash_1.default.get(task.watch, 'ignore', [])]);
    if (watchMatches === undefined) {
        return logger.error('Not found any watch matches for task'.red, `"${task.name}"`.cyan.bold);
    }
    const watcher = (0, chokidar_1.watch)(watchMatches, { ignored: config_1.default.defaultIgnoredDirs.concat(ignoreList) });
    logger.info('Task'.gray, `"${task.name}"`.cyan.bold, 'is watching for:'.gray, lodash_1.default.flatten([watchMatches]).join());
    watcher.on('change', filePath => {
        logger.info('File'.gray, `"${filePath}"`.bold, 'has been changed'.gray);
        const pathOption = lodash_1.default.get(task.watch, 'triggerOnly', false) ? undefined : path_1.default.normalize(filePath);
        return handler(pathOption);
    });
};
exports.setupTaskWatcher = setupTaskWatcher;
//# sourceMappingURL=Watcher.js.map