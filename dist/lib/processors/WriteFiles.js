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
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const errors_1 = require("../errors");
const handler = ({ logger }) => ({ files }, { dir, name, ext }) => __awaiter(void 0, void 0, void 0, function* () {
    for (const file of files) {
        file.insert({ dir, name, ext });
        yield fs_1.promises.writeFile(file.path, file.content).catch(error => {
            throw new errors_1.ProcessorError(`Write file "${file.name.red}" to "${file.path.yellow}"`, error.message);
        });
        logger.info('File'.gray, `"${file.name}"`, 'writed to'.gray, `"${file.path.yellow}"`);
    }
});
exports.default = handler;
//# sourceMappingURL=WriteFiles.js.map