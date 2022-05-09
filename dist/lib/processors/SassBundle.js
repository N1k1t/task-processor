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
const sass_1 = require("sass");
const errors_1 = require("../errors");
const handler = ({}) => ({ files }, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([...files].map((file) => __awaiter(void 0, void 0, void 0, function* () {
        const resultOptions = Object.assign(Object.assign({}, options), { loadPaths: lodash_1.default.uniq([file.dir].concat(options.paths || [])) });
        const result = yield (0, sass_1.compileStringAsync)(file.content.toString(), resultOptions).catch(error => {
            throw new errors_1.ProcessorError(`Bundling file "${file.path.red}"`, error.message);
        });
        file.setContent(result.css);
        file.setExt('.css');
    })));
});
exports.default = handler;
//# sourceMappingURL=SassBundle.js.map