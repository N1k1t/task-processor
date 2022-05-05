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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTask = void 0;
const worker_threads_1 = require("worker_threads");
const worker_1 = require("threads/worker");
const Console_1 = require("./Console");
const processors_1 = require("../processors");
const Context_1 = require("./Context");
const Thread_1 = require("./Thread");
/*----------  Module deps  ----------*/
const logger = (0, Console_1.buildLogger)(Thread_1.isMainThread ? 'Worker' : `Worker #${worker_threads_1.threadId}`, 'cyan');
const breakSymbol = Symbol('Break');
const addFilesToContext = (task, details, runnerContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = details.addFiles) === null || _a === void 0 ? void 0 : _a.path) === undefined) {
        return null;
    }
    return processors_1.processors['get-files']({ task, details, logger: logger.useScope('get-files') })(runnerContext, {
        path: details.addFiles.path
    });
});
/*----------  Exports  ----------*/
const runTask = (inputedTask, details) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Thread_1.loadTasksContext)(details.config.execPath);
    const task = (0, Thread_1.getTaskContext)(details.type, inputedTask);
    const runnerContext = (0, Context_1.buildContext)();
    const addFilesResult = yield addFilesToContext(task, details, runnerContext).catch(error => {
        logger.error(error.message);
        return breakSymbol;
    });
    if (addFilesResult === breakSymbol) {
        return null;
    }
    for (let _b of task.use) {
        const { processor: name } = _b, options = __rest(_b, ["processor"]);
        if (processors_1.processors[name] === undefined) {
            logger.error(`Processor "${name}" is not exists`);
            return null;
        }
        const processorLogger = logger.useScope(name);
        const processorContext = { task, details, logger: processorLogger };
        const result = yield processors_1.processors[name](processorContext)(runnerContext, options)
            .catch(error => {
            processorLogger.error(error.message);
            return breakSymbol;
        });
        if (result === breakSymbol) {
            return null;
        }
    }
    return (0, Context_1.toThreadContext)(runnerContext);
});
exports.runTask = runTask;
/*----------  Thread deps  ----------*/
if (!Thread_1.isMainThread) {
    const workerModule = { runTask: exports.runTask };
    (0, worker_1.expose)(workerModule);
}
//# sourceMappingURL=TaskWorker.js.map