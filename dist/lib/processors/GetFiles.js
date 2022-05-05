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
const fs_1 = require("fs");
const errors_1 = require("../errors");
const handler = ({ logger }) => ({ buildFile, files }, { path }) => __awaiter(void 0, void 0, void 0, function* () {
    const filePaths = lodash_1.default.flatten([path]).filter(filePath => filePath !== undefined);
    if (filePaths.length === 0) {
        throw new errors_1.ProcessorError(`File paths are invalid and have values: ${(path || 'undefined').toString().red}`);
    }
    for (const filePath of filePaths) {
        const file = yield fs_1.promises.readFile(filePath).catch(error => {
            throw new errors_1.ProcessorError(`File "${filePath.red}" can't be readed`, error.message);
        });
        files.push(buildFile(filePath, file));
    }
    logger.info('Got'.gray, String(files.length).yellow, 'file(s)'.gray);
});
exports.default = handler;
//# sourceMappingURL=GetFiles.js.map