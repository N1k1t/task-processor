import 'colors';

import { createInterface } from 'readline';
import gradient from 'gradient-string';
import { readFileSync } from 'fs';
import path from 'path';

import { version } from '../../package.json';

/*----------  Types  ----------*/

import { ICliTask, TColoredMessage } from '../typings';

type TLoggerFn = (...messages: TColoredMessage[]) => void

interface ILoggerBase {
	info: TLoggerFn
	error: TLoggerFn
	emptyLine: () => ILoggerBase
}
interface ILoggerHelpers {
	useScope: (scope: string) => ILoggerBase
}

/*----------  Module deps  ----------*/

const appLabelPath: string = path.resolve(__dirname, '../../../assets/ascii-hello-text.txt');
const appLabel: string = readFileSync(appLabelPath).toString();

const lineInterface = createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

const buildAvailableTasksMessage = (tasks: ICliTask[]): string => {
	const offsetLeft = '  > '.gray;
	const helpMessage = [offsetLeft, '-tasks'.white.bgCyan.bold, ''.padEnd(15, ' '), 'Type it to get list of your tasks'.gray].join('');

	const messages = tasks.map(({ name, description = 'Empty description' }) => [
		offsetLeft,
		String(name).padEnd(21, ' ').cyan.bold,
		description
	].join(''));

	return [helpMessage].concat(messages).join('\n');
}

const printTasksMessage = (tasks: ICliTask[]): void => {
	return console.log([
		'You can run these tasks from here (just type its name):\n'.gray,
		`${buildAvailableTasksMessage(tasks)}\n`
	].join(''));
}

/*----------  Exports  ----------*/

export type TLogger<T = {}> = T & ILoggerBase

export const useLineInterface = (tasks: ICliTask[], handler: (line: string) => void): void => {
	printTasksMessage(tasks);

	lineInterface.on('line', line => {
		switch (line.trim()) {
			case '': return null;
			case '-tasks': return printTasksMessage(tasks);
			default: return handler(line.trim());
		}
	});
}

export const printHello = (): void => console.log([
	gradient.pastel.multiline(appLabel), 
	`Version "${version}"`.gray
].join('\n'))

export const buildLogger = (title: string, color: string, hasTime: boolean = true): TLogger<ILoggerHelpers> => {
	const infoLog = (scope: string | null = null) => (...messages: TColoredMessage[]) => console.log(...[
			hasTime ? new Date().toLocaleTimeString().gray : null,
			String(` [${title}]`.padEnd(15, ' '))[<keyof String>color],
			scope && String(`<${scope}>`)[<keyof String>color],
			messages.join(' ')].filter(segment => segment !== null));

	const errorLog = (scope: string | null = null) => (...messages: TColoredMessage[]) => console.error(...[
			hasTime ? new Date().toLocaleTimeString().gray : null,
			String(` [${title}]`.padEnd(15, ' '))[<keyof String>color],
			scope && `<${scope}>`.white.bgRed.bold,
			'Error:'.red,
			messages.join(' ')].filter(segment => segment !== null));

	const emptyLineLog = () => {
		console.log('');
		return logger;
	};

	const logger = {
		info: infoLog(null),
		error: errorLog(null),
		emptyLine: emptyLineLog,

		useScope: (scope: string) => ({
			info: infoLog(scope),
			error: errorLog(scope),
			emptyLine: emptyLineLog
		})
	};

	return logger;
}
