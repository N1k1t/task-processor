import 'colors';

import { createInterface } from 'readline';
import gradient from 'gradient-string';
import { readFileSync } from 'fs';
import path from 'path';

import { version } from '../../package.json';

/*----------  Types  ----------*/

import { ICliTask } from '../typings';

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
