"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printHello = exports.useLineInterface = void 0;
require("colors");
const readline_1 = require("readline");
const gradient_string_1 = __importDefault(require("gradient-string"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const package_json_1 = require("../../package.json");
/*----------  Module deps  ----------*/
const appLabelPath = path_1.default.resolve(__dirname, '../../../assets/ascii-hello-text.txt');
const appLabel = (0, fs_1.readFileSync)(appLabelPath).toString();
const lineInterface = (0, readline_1.createInterface)({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
const buildAvailableTasksMessage = (tasks) => {
    const offsetLeft = '  > '.gray;
    const helpMessage = [offsetLeft, '-tasks'.white.bgCyan.bold, ''.padEnd(15, ' '), 'Type it to get list of your tasks'.gray].join('');
    const messages = tasks.map(({ name, description = 'Empty description' }) => [
        offsetLeft,
        String(name).padEnd(21, ' ').cyan.bold,
        description
    ].join(''));
    return [helpMessage].concat(messages).join('\n');
};
const printTasksMessage = (tasks) => {
    return console.log([
        'You can run these tasks from here (just type its name):\n'.gray,
        `${buildAvailableTasksMessage(tasks)}\n`
    ].join(''));
};
/*----------  Exports  ----------*/
const useLineInterface = (tasks, handler) => {
    printTasksMessage(tasks);
    lineInterface.on('line', line => {
        switch (line.trim()) {
            case '': return null;
            case '-tasks': return printTasksMessage(tasks);
            default: return handler(line.trim());
        }
    });
};
exports.useLineInterface = useLineInterface;
const printHello = () => console.log([
    gradient_string_1.default.pastel.multiline(appLabel),
    `Version "${package_json_1.version}"`.gray
].join('\n'));
exports.printHello = printHello;
//# sourceMappingURL=LineInterface.js.map