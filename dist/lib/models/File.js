"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
/*----------  Exports  ----------*/
class File {
    constructor(filePath, content) {
        const source = path_1.default.parse(filePath);
        Object.assign(this, lodash_1.default.pick(source, ['base', 'root']), { source, dist: source });
        Object.assign(this.source, { content });
    }
    get path() {
        return this.dist.path || path_1.default.join(this.dir, this.name, this.ext);
    }
    get name() {
        return this.dist.name || this.source.name;
    }
    get dir() {
        return this.dist.dir || this.source.dir;
    }
    get ext() {
        return this.dist.ext || this.source.ext;
    }
    get content() {
        return this.dist.content || this.source.content;
    }
    setContent(value) {
        this.dist.content = value;
        return this;
    }
    setExt(value) {
        this.dist.ext = value;
        return this;
    }
    setPath(value) {
        this.dist.path = value;
        return this;
    }
    setName(value) {
        this.dist.name = value;
        return this;
    }
    insert({ dir, name, ext }) {
        Object.assign(this.dist, {
            dir: dir !== null && dir !== void 0 ? dir : this.dist.dir,
            name: name !== null && name !== void 0 ? name : this.dist.name,
            ext: ext !== null && ext !== void 0 ? ext : this.dist.ext
        });
        return this;
    }
}
exports.default = File;
//# sourceMappingURL=File.js.map