import { ParsedPath } from 'path';
import { IProcessorRunnerContext, IFile } from './Processor';
import { TValueOf } from './Etc';
import { TProcessorOptions } from '../processors';
import config from '../../config';

export interface ITask {
	name: string
	use: TValueOf<TProcessorOptions>[]
	description?: string
}

export interface ICliTask extends ITask {
	add?: string | string[] | {
		path: string | string[]
	}
}

export interface IBackgroundTask extends ITask {
	watch: string | string[] | { 
		ignore?: string | string[] 
		match: string | string[]
		triggerOnly?: boolean
	}
}

export interface ITaskHandlerDetails {
	type: 'cli' | 'background'
	config: typeof config
	addFiles?: {
		path: string | string[]
	}
}

export type TProcessorThreadFile = Pick<IFile, keyof ParsedPath | 'path' | 'content' | 'result'>
export type TProcessorThreadContext = Pick<IProcessorRunnerContext, 'livereload'> & { files: TProcessorThreadFile[] }

export interface ITaskHandler {
	runTask: (task: ITask, details: ITaskHandlerDetails) => Promise<TProcessorThreadContext | null>
}
