import { ITask, ITaskHandlerDetails, TProcessorThreadContext } from '../typings';
declare type TTaskHandlerResult = Promise<(TProcessorThreadContext | null)[] | null>;
export declare const handleTask: (task: ITask, details: ITaskHandlerDetails) => TTaskHandlerResult;
export {};
