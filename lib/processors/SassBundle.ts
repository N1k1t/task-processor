import _ from 'lodash';
import { compileStringAsync, StringOptions } from 'sass';

import { TProcessorGenerator } from '../typings';
import { ProcessorError } from '../errors';

export interface ISassBundleOptions extends Omit<StringOptions<'async'>, 'data' | 'loadPaths'> {
	paths?: string[]
}

const handler: TProcessorGenerator<ISassBundleOptions> = ({ }) => async ({ files }, options = {}) => {
	await Promise.all([...files].map(async (file) => {
		const resultOptions = { 
			...options,
			loadPaths: _.uniq([file.dir].concat(options.paths || [])),
		};
		
		const result = await compileStringAsync(file.content.toString(), resultOptions).catch(error => {
			throw new ProcessorError(`Bundling file "${file.path.red}"`, error.message);
		});

		file.setContent(result.css);
		file.setExt('.css');
	}));
}

export default handler
