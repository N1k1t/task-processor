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
const lodash_1 = __importDefault(require("lodash"));
const syntax_error_1 = __importDefault(require("syntax-error"));
const browserify_1 = __importDefault(require("browserify"));
const stream_1 = require("stream");
const path_1 = __importDefault(require("path"));
const errors_1 = require("../errors");
function handleSyntaxErrors(file, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const error = (0, syntax_error_1.default)(content, file.path);
        if (error !== undefined) {
            throw new errors_1.ProcessorError(`Please check file "${file.path.red}"`, error.annotated.trim());
        }
    });
}
const handler = ({}) => ({ files }, options) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        const fileStream = new stream_1.Readable();
        fileStream.push(file.content);
        fileStream.push(null);
        yield handleSyntaxErrors(file, file.content);
        const bundler = (0, browserify_1.default)(fileStream, Object.assign(Object.assign({}, options), { paths: lodash_1.default.uniq([path_1.default.normalize(`${process.cwd()}/node_modules`), file.dir].concat(options.paths || [])), basedir: file.dir }));
        return new Promise((resolve, reject) => bundler.bundle((error, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                reject(new errors_1.ProcessorError(`Bundle file "${file.path.red}"`, error === null || error === void 0 ? void 0 : error.message));
            }
            yield handleSyntaxErrors(file, result).catch(error => reject(error));
            file.setContent(result);
            resolve(file);
        })));
    })));
});
exports.default = handler;
//# sourceMappingURL=CommonjsBundle.js.map