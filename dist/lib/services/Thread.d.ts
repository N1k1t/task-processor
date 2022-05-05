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
export declare const useThreads: TFn<[], void> | (({ execPath }: {
    execPath: string;
}) => void);
