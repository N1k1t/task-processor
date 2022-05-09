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
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const errors_1 = require("../errors");
const createPictureFile = ({ files, buildFile }) => {
    const emptyFile = buildFile(path_1.default.join(process.cwd(), `unnamed.png`), Buffer.from(''));
    files.add(emptyFile);
};
const createSharpPipeline = (file, options) => {
    const sharpOptions = lodash_1.default.omit(options, ['pipeline', 'ext']);
    if (file.content.length === 0) {
        return (0, sharp_1.default)(sharpOptions);
    }
    return (0, sharp_1.default)(file.content, sharpOptions);
};
const handler = ({}) => (context, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const { pipeline = parser => parser } = options;
    if (context.files.size === 0) {
        createPictureFile(context);
    }
    yield Promise.all([...context.files].map((file) => __awaiter(void 0, void 0, void 0, function* () {
        const { data: result, info } = yield pipeline(createSharpPipeline(file, options))
            .toBuffer({ resolveWithObject: true })
            .catch(error => {
            var _a;
            throw new errors_1.ProcessorError(((_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error) || 'Unknown error');
        });
        file.setContent(result);
        file.setExt(info.format);
    })));
});
exports.default = handler;
//# sourceMappingURL=Sharp.js.map