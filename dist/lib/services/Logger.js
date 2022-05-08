"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLogger = void 0;
require("colors");
const models_1 = require("../models");
/*----------  Exports  ----------*/
const buildLogger = (title, color, hasTime = true) => {
    return new models_1.Logger(title, color, { hasTime });
};
exports.buildLogger = buildLogger;
//# sourceMappingURL=Logger.js.map