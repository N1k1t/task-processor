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
exports.useThreads = exports.getTaskContext = exports.loadTasksContext = exports.registerThreadTaskContext = exports.queueThread = exports.useInSlaveThread = exports.useInMainThread = exports.isMainThread = void 0;
const lodash_1 = __importDefault(require("lodash"));
const worker_threads_1 = require("worker_threads");
const threads_1 = require("threads");
const os_1 = require("os");
const config_1 = __importDefault(require("../../config"));
const instance = {
    pool: { queue: () => __awaiter(void 0, void 0, void 0, function* () { return null; }) },
    tasks: {
        cli: [],
        background: []
    }
};
const spawnThreads = () => Object.assign(instance, { pool: (0, threads_1.Pool)(() => (0, threads_1.spawn)(new threads_1.Worker('./TaskWorker')), (0, os_1.cpus)().length) });
var worker_threads_2 = require("worker_threads");
Object.defineProperty(exports, "isMainThread", { enumerable: true, get: function () { return worker_threads_2.isMainThread; } });
const useInMainThread = (fn) => {
    if (!worker_threads_1.isMainThread) {
        return () => null;
    }
    return fn;
};
exports.useInMainThread = useInMainThread;
const useInSlaveThread = (fn) => {
    if (worker_threads_1.isMainThread) {
        return () => null;
    }
    return fn;
};
exports.useInSlaveThread = useInSlaveThread;
const queueThread = (fn) => __awaiter(void 0, void 0, void 0, function* () { return instance.pool.queue(fn); });
exports.queueThread = queueThread;
const registerThreadTaskContext = (type, tasks) => {
    lodash_1.default.set(instance.tasks, type, tasks);
};
exports.registerThreadTaskContext = registerThreadTaskContext;
exports.loadTasksContext = (0, exports.useInSlaveThread)((execPath) => require(execPath));
const getTaskContext = (type, task) => {
    if (worker_threads_1.isMainThread) {
        return task;
    }
    const result = instance.tasks[type].find(({ name }) => name === task.name);
    return result || task;
};
exports.getTaskContext = getTaskContext;
exports.useThreads = (0, exports.useInMainThread)(({ execPath }) => {
    if (typeof execPath !== 'string') {
        throw new Error([
            'Options requires'.red,
            'execPath'.red.bold,
            'param in'.red,
            'useThreads'.red.bold,
            'function'.red
        ].join(' '));
    }
    Object.assign(config_1.default, { useThreads: true, execPath });
    spawnThreads();
});
//# sourceMappingURL=Thread.js.map