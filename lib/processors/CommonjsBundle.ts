import _ from 'lodash';
import checkSyntaxError from 'syntax-error';
import browserify, { Options } from 'browserify';
import { Readable } from 'stream';
import path from 'path';

import { TProcessorGenerator, IFile } from '../typings';
import { ProcessorError } from '../errors';
import { IOptions } from 'minimatch';

export interface ICommonjsBundleOptions extends Omit<Options, 'entries'> {
	plugins?: [string, IOptions?][]
}

async function handleSyntaxErrors(file: IFile, content: IFile['content']) {
	const error = checkSyntaxError(content, file.path);
	if (error !== undefined) {
		throw new ProcessorError(`Please check file "${file.path.red}"`, error.annotated.trim());
	}
}

const handler: TProcessorGenerator<ICommonjsBundleOptions> = ({ }) => async ({ files }, options) => {
	await Promise.all(files.map(async (file) => {
		const fileStream = new Readable();

		fileStream.push(file.content);
		fileStream.push(null);

		await handleSyntaxErrors(file, file.content);

		const bundler = browserify(fileStream, {
			...options,
			paths: _.uniq([path.normalize(`${process.cwd()}/node_modules`), file.dir].concat(options.paths || [])),
			basedir: file.dir
		});

		return new Promise((resolve, reject) => bundler.bundle(async (error, result) => {
			if (error) {
				reject(new ProcessorError(`Bundle file "${file.path.red}"`, error?.message));
			}

			await handleSyntaxErrors(file, result).catch(error => reject(error));
			file.setContent(result);
			
			resolve(file);
		}));
	}));
}

export default handler
