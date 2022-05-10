import _ from 'lodash';
import path from 'path';
import sharp, { Sharp, SharpOptions } from 'sharp';

import { TProcessorGenerator, IProcessorRunnerContext, IFile } from '../typings';
import { ProcessorError } from '../errors';

export interface ISharpOptions extends SharpOptions {
	pipeline?: (sharp: Sharp) => Sharp
}

const createPictureFile = ({ files, buildFile }: IProcessorRunnerContext): void => {
	const emptyFile = buildFile(path.join(process.cwd(), `unnamed.png`), Buffer.from(''));
	files.add(emptyFile);
}

const createSharpPipeline = (file: IFile, options: ISharpOptions): Sharp => {
	const sharpOptions = _.omit(options, ['pipeline', 'ext']);

	if (file.content.length === 0) {
		return sharp(sharpOptions);
	}

	return sharp(file.content, sharpOptions);
}

const handler: TProcessorGenerator<ISharpOptions> = ({ }) => async (context, options = {}) => {
	const { pipeline = parser => parser } = options;

	if (context.files.size === 0) {
		createPictureFile(context);
	}

	await Promise.all([...context.files].map(async (file) => {
		const { data: result, info } = await pipeline(createSharpPipeline(file, options))
			.toBuffer({ resolveWithObject: true })
			.catch(error => {
				throw new ProcessorError((error?.message ?? error) || 'Unknown error');
			});

		file.setContent(result);
		file.setExt(info.format);
	}));
}

export default handler
