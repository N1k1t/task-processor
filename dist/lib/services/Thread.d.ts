import { ICliTask, IBackgroundTask, ITask, ITaskHandler, ITaskHandlerDetails, TFn } from '../typings';
declare type TThredWorkerFn = (worker: ITaskHandler) => unknown;
declare type TThreadQueueFn<T> = (fn: TThredWorkerFn) => Promise<T | null>;
export { isMainThread } from 'worker_threads';
export declare const useInMainThread: <T extends Function>(fn: T) => T | TFn<[], void>;
export declare const useInSlaveThread: <T extends Function>(fn: T) => TFn<[], void> | T;
export declare const queueThread: <T>(fn: TThredWorkerFn) => Promise<T | null>;
export declare const registerThreadTaskContext: (type: ITaskHandlerDetails['type'], tasks: (ICliTask | IBackgroundTask)[]) => void;
export declare const loadTasksContext: TFn<[], void> | ((execPath: string) => any);
export declare const getTaskContext: (type: ITaskHandlerDetails['type'], task: ITask) => ITask;
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
export declare const useThreads: TFn<[], void> | (({ execPath }: {
    execPath: string;
}) => void);
