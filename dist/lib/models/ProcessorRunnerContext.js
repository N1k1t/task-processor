"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const File_1 = __importDefault(require("./File"));
/*----------  Exports  ----------*/
class ProcessorRunnerContext {
    constructor() {
        this.files = new Set();
        this.livereload = {
            enabled: false,
            action: null
        };
    }
    useLivereload(action) {
        Object.assign(this.livereload, { enabled: true, action });
    }
    buildFile(filePath, content) {
        return new File_1.default(filePath, content);
    }
    convertToThread() {
        return Object.assign(Object.assign({}, lodash_1.default.pick(this, ['livereload'])), { files: [...this.files].map(file => (Object.assign(Object.assign({}, file.dist), { path: file.path }))) });
    }
}
exports.default = ProcessorRunnerContext;
//# sourceMappingURL=ProcessorRunnerContext.js.map