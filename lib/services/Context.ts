import path from 'path';
import _ from 'lodash';

/*----------  Types  ----------*/

import { 
	IProcessorRunnerContext, 
	TProcessorThreadContext, 
	IFile 
} from '../typings';

/*----------  Exports  ----------*/

export const buildContext = (): IProcessorRunnerContext => {
	const files: IFile[] = [];
	const livereload = {
		enabled: false,
		action: null
	};

	return {
		files,
		livereload,

		buildFile(filePath: string, content: string | Buffer): IFile {
			const refreshResultPath = () => result.path = `${result.dir}/${result.name}${result.ext}`;
			const carriRefreshResult = (fn: () => unknown) => (fn() || true) && refreshResultPath();
			const result = {
				...path.parse(filePath),
				path: path.normalize(filePath),
				content
			};

			return {
				...result,
				result,

				setContent: (value: string | Buffer) => result.content = value,
				setExt: (value: string) => carriRefreshResult(() => result.ext = value),
				setPath: (value: string) => carriRefreshResult(() => result.path = value),
				
				include: ({ dir, name, ext } = {}) => carriRefreshResult(() => {
					Object.assign(result, { dir: dir ?? result.dir, name: name ?? result.name, ext: ext ?? result.ext })
				})
			}
		},

		useLivereload(action: IProcessorRunnerContext['livereload']['action']) {
			Object.assign(livereload, { enabled: true, action });
		}
	}
}

export function toThreadContext(context: IProcessorRunnerContext): TProcessorThreadContext {
	return {
		..._.pick(context, ['livereload']),
		files: context.files.map(file => _.pick(file, [
			'root', 
			'dir', 
			'base', 
			'ext', 
			'name', 
			'path', 
			'content', 
			'result'
		]))
	};
}