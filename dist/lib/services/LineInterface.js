"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printHello = exports.setupLineInterface = void 0;
require("colors");
const readline_1 = require("readline");
const gradient_string_1 = __importDefault(require("gradient-string"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const package_json_1 = require("../../package.json");
const lineInterface = (0, readline_1.createInterface)({
    input: process.stdin,
    output: process.stdout
});
function buildHelloMessage() {
    return gradient_string_1.default.pastel.multiline((0, fs_1.readFileSync)(path_1.default.normalize(`${__dirname}/../../../ascii-hello-text.txt`)).toString());
}
function buildAvailableTasksMessage(tasks) {
    const messages = tasks.map(({ name, description = 'Empty description' }) => [
        '  - '.gray,
        String(name).cyan.bold,
        ': '.gray,
        '\t',
        String(description)
    ].join(''));
    return messages.join('\n');
}
function setupLineInterface(tasks) {
    lineInterface.write(['You can run these tasks from here (just type it name):\n'.gray, `${buildAvailableTasksMessage(tasks)}\n`].join(''));
    lineInterface.prompt();
    lineInterface.on('line', line => {
        console.log('#', line);
    });
}
exports.setupLineInterface = setupLineInterface;
function printHello() {
    lineInterface.write([buildHelloMessage(), `Version "${package_json_1.version}"`.gray, ''].join('\n'));
}
exports.printHello = printHello;
//# sourceMappingURL=LineInterface.js.map