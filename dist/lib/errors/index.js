"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessorError = void 0;
class ProcessorError extends Error {
    constructor(header, errorMessage) {
        super([
            header,
            errorMessage && `\n${'---------------------'.red}\n${errorMessage}\n${'---------------------'.red}`
        ].filter(segment => segment !== undefined).join(' '));
        this.header = header;
    }
}
exports.ProcessorError = ProcessorError;
//# sourceMappingURL=index.js.map