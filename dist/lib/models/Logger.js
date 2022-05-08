"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
/*----------  Exports  ----------*/
class Logger {
    constructor(title, color, config = {}) {
        this.title = title;
        this.color = color;
        this.config = config;
        Object.assign(this.config, lodash_1.default.defaults(this.config, {
            hasTime: true,
            scope: null
        }));
    }
    info(...messages) {
        return console.log(...[
            this.config.hasTime ? new Date().toLocaleTimeString().gray : null,
            String(` [${this.title}]`.padEnd(15, ' '))[this.color],
            this.config.scope && `<${this.config.scope}>`[this.color],
            messages.join(' ')
        ].filter(segment => segment !== null));
    }
    error(...messages) {
        return console.error(...[
            this.config.hasTime ? new Date().toLocaleTimeString().gray : null,
            String(` [${this.title}]`.padEnd(15, ' '))[this.color],
            this.config.scope && `<${this.config.scope}>`[this.color],
            'Error:'.red,
            messages.join(' ')
        ].filter(segment => segment !== null));
    }
    emptyLine() {
        console.log('');
        return this;
    }
    useScope(scope) {
        this.config.scope = scope;
        return this;
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map