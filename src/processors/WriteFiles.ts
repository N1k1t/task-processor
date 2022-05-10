import { promises as fs } from 'fs';
import { TProcessorGenerator } from '../typings';
import { ProcessorError } from '../errors';

export interface IWriteFilesOptions {
	dir?: string
	name?: string
	ext?: string
}

const handler: TProcessorGenerator<IWriteFilesOptions> = ({ logger }) => async ({ files }, { dir, name, ext }) => {
	for (const file of files) {
		file.insert({ dir, name, ext });


		await fs.writeFile(file.path, file.content).catch(error => {
			throw new ProcessorError(`Write file "${file.name.red}" to "${file.path.yellow}"`, error.message);
		});

		logger.info('File'.gray, `"${file.name}"`, 'writed to'.gray, `"${file.path.yellow}"`);
	}
}

export default handler
