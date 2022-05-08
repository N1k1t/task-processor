import { ParsedPath } from 'path';

import { ITask, ITaskHandlerDetails } from './Task';
import { TValueOf, ILogger } from './Common';
import { ProcessorRunnerContext, File } from '../models';
import { TProcessorOptions } from '../processors';

export type TProcessorName = keyof TProcessorOptions

export interface IProcessorContext {
	readonly task: ITask
	readonly details: ITaskHandlerDetails
	readonly logger: ILogger
}

export interface IFile extends File {}
export interface IProcessorRunnerContext extends ProcessorRunnerContext {}

export type TProcessorHandler<T extends TValueOf<TProcessorOptions>> = (context: IProcessorRunnerContext, options: T) => Promise<void>
export type TProcessorGenerator<T extends TValueOf<TProcessorOptions>> = (context: IProcessorContext) => TProcessorHandler<T>

export type TProcessorThreadFile = Pick<IFile, keyof ParsedPath | 'path' | 'content'>
export type TProcessorThreadContext = Pick<IProcessorRunnerContext, 'livereload'> & { files: TProcessorThreadFile[] }
