"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProcessorRunnerContext = void 0;
const models_1 = require("../models");
/*----------  Exports  ----------*/
const buildProcessorRunnerContext = () => {
    const context = new models_1.ProcessorRunnerContext();
    return Object.assign(context, {
        useLivereload: context.useLivereload.bind(context),
        convertToThread: context.convertToThread.bind(context)
    });
};
exports.buildProcessorRunnerContext = buildProcessorRunnerContext;
//# sourceMappingURL=Context.js.map