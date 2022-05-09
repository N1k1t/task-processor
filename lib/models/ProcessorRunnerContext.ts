import _ from 'lodash';
import File from './File';

/*----------  Types  ----------*/

import {
	TLivereloadAction,
	TProcessorThreadContext
} from '../typings';

interface ILivereloadConfig {
	enabled: boolean
	action: TLivereloadAction | null
}

/*----------  Exports  ----------*/

export default class ProcessorRunnerContext {
	public readonly files: Set<File> = new Set()
	public readonly livereload: ILivereloadConfig = {
		enabled: false,
		action: null
	}

	public useLivereload(action: TLivereloadAction): void {
		Object.assign(this.livereload, { enabled: true, action });
	}

	public buildFile(filePath: File['path'], content: File['content']): File {
		return new File(filePath, content);
	}

	public convertToThread(): TProcessorThreadContext {
		return {
			..._.pick(this, ['livereload']),
			files: [...this.files].map(file => ({ ...file.dist, path: file.path }))
		};
	}
}
