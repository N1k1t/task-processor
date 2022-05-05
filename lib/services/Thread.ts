import _ from 'lodash';
import { isMainThread } from 'worker_threads';
import { spawn, Pool, Worker } from 'threads';
import { cpus } from 'os';

import config from '../../config';

/*----------  Types  ----------*/

import { 
	ICliTask, 
	IBackgroundTask, 
	ITask, 
	ITaskHandler,
	ITaskHandlerDetails,
	TFn
} from '../typings';

type TThredWorkerFn = (worker: ITaskHandler) => unknown
type TThreadQueueFn<T> = (fn: TThredWorkerFn) => Promise<T | null>
type TThreadInstance<T> = { 
	pool: { queue: TThreadQueueFn<T> },
	tasks: { [key in ITaskHandlerDetails['type']]: (ICliTask | IBackgroundTask)[] }
}

/*----------  Module deps  ----------*/

const instance: TThreadInstance<null> = {
	pool: { queue: async () => null },
	tasks: {
		cli: [],
		background: []
	}
}

const spawnThreads = () => Object.assign(instance, { pool: Pool(() => spawn(new Worker('./TaskWorker')), cpus().length) });

/*----------  Exports  ----------*/

export { isMainThread } from 'worker_threads';

export const useInMainThread = <T extends Function>(fn: T): T | TFn<[]> => {
	if (!isMainThread) {
		return () => null
	}

	return fn;
}

export const useInSlaveThread = <T extends Function>(fn: T): T | TFn<[]> => {
	if (isMainThread) {
		return () => null
	}

	return fn;
}

export const queueThread = async <T>(fn: TThredWorkerFn): ReturnType<TThreadQueueFn<T>> => instance.pool.queue(fn);

export const registerThreadTaskContext = (type: ITaskHandlerDetails['type'], tasks: (ICliTask | IBackgroundTask)[]) => {
	_.set(instance.tasks, type, tasks);
}

export const loadTasksContext = useInSlaveThread((execPath: string) => require(execPath));

export const getTaskContext = (type: ITaskHandlerDetails['type'], task: ITask): ITask => {
	if (isMainThread) {
		return task;
	}

	const result = instance.tasks[type].find(({ name }) => name === task.name);
	return result || task;
}

/**
 * @description It creates threads for running tasks there
 * @return void
 *
 * @param {Object} options 				- Threads options
 * @param {number} options.execPath 	- Path of root module which register tasks.
 * 		It's required because it's imposible to forward functions to threads with original lexical enviromnent,
 * 		closure and etc. That helps to forward full tasks context to threads
 *
 * @example
 * ```js
 * import { registerCliTasks, useThreads } from '@n1k1t/task-processor';
 *
 * useThreads({ execPath: module.filepath });
 *
 * registerCliTasks([
 *   {
 *     name: 'some-heavy-task-1',
 *     use: [...]
 *   },
 *   {
 *     name: 'some-heavy-task-2',
 *     use: [...]
 *   },
 *   {
 *     name: 'some-heavy-task-3',
 *     use: [...]
 *   }
 * ]);
 * ```
*/
export const useThreads = useInMainThread(({ execPath }: { execPath: string }) => {
	if (typeof execPath !== 'string') {
		throw new Error([
			'Options requires'.red,
			'execPath'.red.bold,
			'param in'.red,
			'useThreads'.red.bold,
			'function'.red
		].join(' '));
	}

	Object.assign(config, { useThreads: true, execPath });
	spawnThreads();
})
