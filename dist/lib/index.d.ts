import { IBackgroundTask, ICliTask } from './typings';
export { useLivereloadServer, useThreads } from './services';
export { ICliTask, IBackgroundTask, IFile, IProcessorRunnerContext } from './typings';
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
export declare const registerCliTasks: (tasks: ICliTask[]) => void;
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
export declare const registerBackgroundTasks: (tasks: IBackgroundTask[]) => void;
