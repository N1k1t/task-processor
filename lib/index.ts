import _ from 'lodash'
import glob from 'glob';
import { promisify } from 'util';

import config from '../config';
import {
	useLineInterface,
	printHello,
	handleTask,
	buildLogger,
	setupTaskWatcher,
	registerThreadTaskContext,
	isMainThread,
	useInMainThread
} from './services';

/*----------  Types  ----------*/

import { TObject, IBackgroundTask, ICliTask } from './typings';

/*----------  Module deps  ----------*/

const findFiles = promisify(glob);
const logger = buildLogger('System', 'yellow');

useInMainThread(() => printHello())();

const handleLineCommand = async (tasks: TObject<ICliTask>, command: string): Promise<void> => {
	const task = tasks[command]
	if (task === undefined) {
		return logger.info('Task', `"${command}"`.red, 'was not found');
	}

	const filesToAdd = _.flatten([task.add?.path]).filter(path => path !== undefined);
	const ignoreList = _.flatten([_.get(task.add, 'ignore', [])]);
	const results = await Promise.all(filesToAdd.map(match => findFiles(<string>match, { 
		ignore: config.defaultIgnoredDirs.concat(ignoreList)
	})));

	handleTask(task, { config, type: 'cli', addFiles: { path: _.uniq(_.flatten(results)) } });
}

/*----------  Exports  ----------*/

export { useLivereloadServer, useThreads } from './services';
export {
	ICliTask,
	IBackgroundTask,
	IFile,
	IProcessorRunnerContext
} from './typings';

export const registerCliTasks = (tasks: ICliTask[]): void => {
	if (!isMainThread) {
		return registerThreadTaskContext('cli', tasks);
	}

	const tasksMap = tasks.reduce((acc, task) => _.set(acc, task.name, task), <TObject<ICliTask>>{});

	logger.emptyLine().info('Preparing of cli tasks...'.gray);
	useLineInterface(tasks, line => handleLineCommand(tasksMap, line));
}

export const registerBackgroundTasks = (tasks: IBackgroundTask[]): void => {
	if (!isMainThread) {
		return registerThreadTaskContext('background', tasks);
	}

	logger.emptyLine().info('Preparing of background tasks...'.gray);

	tasks.forEach(task => {
		setupTaskWatcher(task, path => handleTask(task, { 
			config,
			type: 'background',
			...(path !== undefined && { addFiles: { path } })
		}));
	});
}
