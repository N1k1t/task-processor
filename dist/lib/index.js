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
exports.registerBackgroundTasks = exports.registerCliTasks = exports.useThreads = exports.useLivereloadServer = void 0;
const lodash_1 = __importDefault(require("lodash"));
const glob_1 = __importDefault(require("glob"));
const util_1 = require("util");
const config_1 = __importDefault(require("../config"));
const services_1 = require("./services");
const findFiles = (0, util_1.promisify)(glob_1.default);
const logger = (0, services_1.buildLogger)('System', 'yellow');
(0, services_1.useInMainThread)(() => (0, services_1.printHello)())();
const handleLineCommand = (tasks, command) => __awaiter(void 0, void 0, void 0, function* () {
    const task = tasks[command];
    if (task === undefined) {
        return logger.info('Task', `"${command}"`.red, 'was not found');
    }
    const filesToAdd = lodash_1.default.flatten([lodash_1.default.get(task.add, 'path', task.add)]).filter(path => path !== undefined);
    const ignoreList = lodash_1.default.flatten([lodash_1.default.get(task.add, 'ignore', [])]);
    const results = yield Promise.all(filesToAdd.map(match => findFiles(match, {
        ignore: config_1.default.defaultIgnoredDirs.concat(ignoreList)
    })));
    (0, services_1.handleTask)(task, { config: config_1.default, type: 'cli', addFiles: { path: lodash_1.default.uniq(lodash_1.default.flatten(results)) } });
});
var services_2 = require("./services");
Object.defineProperty(exports, "useLivereloadServer", { enumerable: true, get: function () { return services_2.useLivereloadServer; } });
Object.defineProperty(exports, "useThreads", { enumerable: true, get: function () { return services_2.useThreads; } });
const registerCliTasks = (tasks) => {
    if (!services_1.isMainThread) {
        return (0, services_1.registerThreadTaskContext)('cli', tasks);
    }
    const tasksMap = tasks.reduce((acc, task) => lodash_1.default.set(acc, task.name, task), {});
    logger.emptyLine().info('Preparing of cli tasks...'.gray);
    (0, services_1.useLineInterface)(tasks, line => handleLineCommand(tasksMap, line));
};
exports.registerCliTasks = registerCliTasks;
const registerBackgroundTasks = (tasks) => {
    if (!services_1.isMainThread) {
        return (0, services_1.registerThreadTaskContext)('background', tasks);
    }
    logger.emptyLine().info('Preparing of background tasks...'.gray);
    tasks.forEach(task => {
        (0, services_1.setupTaskWatcher)(task, path => (0, services_1.handleTask)(task, Object.assign({ config: config_1.default, type: 'background' }, (path !== undefined && { addFiles: { path } }))));
    });
};
exports.registerBackgroundTasks = registerBackgroundTasks;
//# sourceMappingURL=index.js.map