import { IBackgroundTask, ICliTask } from './typings';
export { useLivereloadServer, useThreads } from './services';
export { ICliTask, IBackgroundTask, IFile, IProcessorRunnerContext } from './typings';
export declare const registerCliTasks: (tasks: ICliTask[]) => void;
export declare const registerBackgroundTasks: (tasks: IBackgroundTask[]) => void;
