import _ from 'lodash';
import { promises as fs } from 'fs';
import { TProcessorGenerator } from '../typings';
import { ProcessorError } from '../errors';

export interface IGetFilesOptions {
	path: string | string[]
}

const handler: TProcessorGenerator<IGetFilesOptions> = ({ logger }) => async ({ buildFile, files }, { path }) => {
	const filePaths = _.flatten([path]).filter(filePath => filePath !== undefined);
	
	if (filePaths.length === 0) {
		throw new ProcessorError(`File paths are invalid and have values: ${(path || 'undefined').toString().red}`);
	}

	for (const filePath of <string[]>filePaths) {
		const file = await fs.readFile(filePath).catch(error => {
			throw new ProcessorError(`File "${filePath.red}" can't be readed`, error.message);
		});

		files.add(buildFile(filePath, file));
	}

	logger.info('Got'.gray, String(files.size).yellow, 'file(s)'.gray);
}

export default handler
