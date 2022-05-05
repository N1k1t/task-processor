"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toThreadContext = exports.buildContext = void 0;
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const buildContext = () => {
    const files = [];
    const livereload = {
        enabled: false,
        action: null
    };
    return {
        files,
        livereload,
        buildFile(filePath, content) {
            const refreshResultPath = () => result.path = `${result.dir}/${result.name}${result.ext}`;
            const carriRefreshResult = (fn) => (fn() || true) && refreshResultPath();
            const result = Object.assign(Object.assign({}, path_1.default.parse(filePath)), { path: path_1.default.normalize(filePath), content });
            return Object.assign(Object.assign({}, result), { result, setContent: (value) => result.content = value, setExt: (value) => carriRefreshResult(() => result.ext = value), setPath: (value) => carriRefreshResult(() => result.path = value), include: ({ dir, name, ext } = {}) => carriRefreshResult(() => {
                    Object.assign(result, { dir: dir !== null && dir !== void 0 ? dir : result.dir, name: name !== null && name !== void 0 ? name : result.name, ext: ext !== null && ext !== void 0 ? ext : result.ext });
                }) });
        },
        useLivereload(action) {
            Object.assign(livereload, { enabled: true, action });
        }
    };
};
exports.buildContext = buildContext;
function toThreadContext(context) {
    return Object.assign(Object.assign({}, lodash_1.default.pick(context, ['livereload'])), { files: context.files.map(file => lodash_1.default.pick(file, [
            'root',
            'dir',
            'base',
            'ext',
            'name',
            'path',
            'content',
            'result'
        ])) });
}
exports.toThreadContext = toThreadContext;
//# sourceMappingURL=Context.js.map