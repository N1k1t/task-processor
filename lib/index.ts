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

	const filesToAdd = _.flatten([_.get(task.add, 'path', task.add)]).filter(path => path !== undefined);
	const ignoreList = _.flatten([_.get(task.add, 'ignore', [])]);
	const results = await Promise.all(filesToAdd.map(match => findFiles(<string>match, { 
		ignore: config.defaultIgnoredDirs.concat(ignoreList)
	})));

	handleTask(task, { config, type: 'cli', addFiles: { path: _.uniq(_.flatten(results)) } });
}

/*----------  Exports  ----------*/

export { useLivereloadServer, useThreads } from './services';

export {
	IFile,
	ICliTask,
	IBackgroundTask,
	IProcessorRunnerContext,
} from './typings';

/**
 * @description Register tasks for exec it from command line
 * @return void
 *
 * @param {ICliTask[]} tasks 						- Array of tasks
 * @param {string} task.name 						- Name of the task (should be unique)
 * @param {string} [task.description]				- Description of the task (will printed in console)
 *
 * @param {string|string[]|Object} [task.add] 		- Minimatch file path(s) that will added to task or object with params
 * @param {string|string[]} task.add.path 			- Minimatch file path(s) that will added to task
 *
 * @param {Object[]} task.use 						- Array of task processors
 *
 * @example
 * ```js
 * import { registerCliTasks } from '@n1k1t/task-processor';
 *
 * registerCliTasks([
 *   {
 *     name: 'css',
 *     add: { path: 'test/src/main.scss' },
 *     use: [
 *       { processor: 'sass-bundle' },
 *       { processor: 'write-files', dir: 'test/dest', name: 'result' },
 *       { processor: 'livereload', type: 'inject' }
 *     ]
 *   }
 * ]);
 * ```
*/
export const registerCliTasks = (tasks: ICliTask[]): void => {
	if (!isMainThread) {
		return registerThreadTaskContext('cli', tasks);
	}

	const tasksMap = tasks.reduce((acc, task) => _.set(acc, task.name, task), <TObject<ICliTask>>{});

	logger.emptyLine().info('Preparing of cli tasks...'.gray);
	useLineInterface(tasks, line => handleLineCommand(tasksMap, line));
}

/**
 * @description Register tasks for running in background (for example, exec task over file changes watcher)
 * @return void
 *
 * @param {IBackgroundTask[]} tasks 				- Array of tasks
 * @param {string} task.name 						- Name of the task (should be unique)
 * @param {string} [task.description]				- Description of the task (will printed in console)
 *
 * @param {string|string[]|Object} [task.watch] 	- Minimatch file path(s) for file changes watcher or object with params
 * @param {string|string[]} task.watch.path 		- Minimatch file path(s) for file changes watcher
 * @param {string|string[]} [task.watch.ignore] 	- Minimatch of ignore files
 * @param {boolean} [task.watch.triggerOnly=false] 	- Use files watcher for task triggering only
 *
 * @param {Object[]} task.use 						- Array of task processors
 *
 * @example
 * ```js
 * import { registerBackgroundTasks } from '@n1k1t/task-processor';
 *
 * registerBackgroundTasks([
 *   {
 *     name: 'css',
 *     watch: { match: 'test/src/*.scss', ignore: ['_*.scss', '*.*.scss'] },
 *     use: [
 *       { processor: 'sass-bundle' },
 *       { processor: 'write-files', dir: 'test/dest' },
 *       { processor: 'livereload', type: 'inject' }
 *     ]
 *   }
 * ]);
 * ```
*/
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
