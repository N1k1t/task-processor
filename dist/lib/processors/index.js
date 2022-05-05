"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processors = void 0;
const CommonjsBundle_1 = __importDefault(require("./CommonjsBundle"));
const GetFiles_1 = __importDefault(require("./GetFiles"));
const WriteFiles_1 = __importDefault(require("./WriteFiles"));
const Middleware_1 = __importDefault(require("./Middleware"));
const SassBundle_1 = __importDefault(require("./SassBundle"));
const Livereload_1 = __importDefault(require("./Livereload"));
exports.processors = {
    'commonjs-bundle': CommonjsBundle_1.default,
    'get-files': GetFiles_1.default,
    'write-files': WriteFiles_1.default,
    'middleware': Middleware_1.default,
    'sass-bundle': SassBundle_1.default,
    'livereload': Livereload_1.default
};
//# sourceMappingURL=index.js.map