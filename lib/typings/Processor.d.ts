import { ParsedPath } from 'path';
import { ITask, ITaskHandlerDetails } from './Task';
import { TValueOf } from './Etc';
import { TLivereloadAction } from './Livereload';
import { TLogger } from '../services/Console';
import { TProcessorOptions } from '../processors';

export type TProcessorName = keyof TProcessorOptions

export interface IProcessorContext {
	readonly task: ITask
	readonly details: ITaskHandlerDetails
	readonly logger: TLogger
}

export interface IFile extends ParsedPath {
	readonly path: string
	readonly content: string | Buffer
	readonly result: ParsedPath & {
		path: string
		content: string | Buffer
	}

	readonly setContent: (value: string | Buffer) => void
	readonly setExt: (value: string) => void
	readonly setPath: (value: string) => void
	readonly include: (options?: Partial<Pick<IFile, 'dir' | 'name' | 'ext'>>) => void
}

export interface IProcessorRunnerContext {
	readonly files: IFile[]
	readonly livereload: {
		enabled: boolean
		action: TLivereloadAction | null
	}

	readonly buildFile: (filePath: string, content: string | Buffer) => IFile
	readonly useLivereload: (action: TLivereloadAction) => void
}

export type TProcessorHandler<T extends TValueOf<TProcessorOptions>> = (context: IProcessorRunnerContext, options: T) => Promise<void>
export type TProcessorGenerator<T extends TValueOf<TProcessorOptions>> = (context: IProcessorContext) => TProcessorHandler<T>
