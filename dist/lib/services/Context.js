"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildContext = void 0;
const models_1 = require("../models");
/*----------  Exports  ----------*/
const buildContext = () => {
    const context = new models_1.ProcessorRunnerContext();
    return Object.assign(context, {
        useLivereload: context.useLivereload.bind(context),
        convertToThread: context.convertToThread.bind(context)
    });
};
exports.buildContext = buildContext;
//# sourceMappingURL=Context.js.map