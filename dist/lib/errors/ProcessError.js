"use strict";
/*----------  Types  ----------*/
Object.defineProperty(exports, "__esModule", { value: true });
/*----------  Exports  ----------*/
class ProcessorError extends Error {
    constructor(header, errorMessage) {
        super([
            header,
            errorMessage && `\n${'---------------------'.red}\n${errorMessage}\n${'---------------------'.red}`
        ].filter(segment => segment !== undefined).join(' '));
        this.header = header;
    }
}
exports.default = ProcessorError;
//# sourceMappingURL=ProcessError.js.map