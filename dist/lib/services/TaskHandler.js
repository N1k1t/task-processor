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
exports.handleTask = void 0;
const lodash_1 = __importDefault(require("lodash"));
const services_1 = require("../services");
const TaskWorker_1 = require("./TaskWorker");
const config_1 = __importDefault(require("../../config"));
/*----------  Module deps  ----------*/
const logger = (0, services_1.buildLogger)(`Master`, 'green');
const checkFileIsCss = (file) => file.ext === '.css';
const checkFileIsImg = (file) => config_1.default.sharpImageFormats.includes(file.ext);
const handleLivereloadInject = (files) => files.forEach(file => {
    if (checkFileIsCss(file)) {
        return services_1.livereloadService.injectCss(file.path);
    }
    if (checkFileIsImg(file)) {
        return services_1.livereloadService.injectImg(file.path);
    }
});
const handleLivereloadTask = ({ files, livereload: { action } }) => {
    switch (action) {
        case 'reload': return services_1.livereloadService.reloadPage();
        case 'inject': return handleLivereloadInject(files);
    }
};
const prepareTaskToThread = (task) => JSON.parse(JSON.stringify(task));
const processTask = (task, details) => __awaiter(void 0, void 0, void 0, function* () {
    const context = config_1.default.useThreads
        ? yield (0, services_1.queueThread)(worker => worker.runTask(prepareTaskToThread(task), details))
        : yield (0, TaskWorker_1.runTask)(task, details);
    if (context === null) {
        return null;
    }
    if (context.livereload.enabled) {
        handleLivereloadTask(context);
    }
    return context;
});
/*----------  Exports  ----------*/
const handleTask = (task, details) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const timestamp = Date.now();
    const loggerHeader = ['Task'.gray, `"${task.name}"`].join(' ');
    const logTaskHasBeenFailed = () => logger.info(loggerHeader, 'has been failed'.red, '\n');
    const logTaskHasBeenDone = () => logger.info(loggerHeader, 'has been done in'.green, `${((Date.now() - timestamp) / 1000).toFixed(2)}s`.green.bold, '\n');
    if ((task.use || []).length === 0) {
        logger.error('Task'.gray, `"${task.name}"`, 'hasn\'t any processors in "use"'.yellow);
        return null;
    }
    if (Array.isArray((_a = details.addFiles) === null || _a === void 0 ? void 0 : _a.path) && ((_b = details.addFiles) === null || _b === void 0 ? void 0 : _b.path.length) === 0) {
        logger.error('Task'.gray, `"${task.name}"`, 'hasn\'t any files to add"'.yellow);
        return null;
    }
    logger.info(loggerHeader, 'has been started'.gray);
    if (details.addFiles === undefined) {
        const result = yield processTask(task, details);
        if (result === null) {
            logTaskHasBeenFailed();
            return null;
        }
        logTaskHasBeenDone();
        return [result];
    }
    const results = yield Promise.all(lodash_1.default.flatten([(_d = (_c = details.addFiles) === null || _c === void 0 ? void 0 : _c.path) !== null && _d !== void 0 ? _d : []]).map((path) => __awaiter(void 0, void 0, void 0, function* () {
        return processTask(task, lodash_1.default.set(lodash_1.default.cloneDeep(details), 'addFiles.path', path));
    })));
    if (results.every(result => result === null)) {
        logTaskHasBeenFailed();
        return null;
    }
    logTaskHasBeenDone();
    return results;
});
exports.handleTask = handleTask;
//# sourceMappingURL=TaskHandler.js.map