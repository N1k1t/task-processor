import commonjsBundleProcessor, { ICommonjsBundleOptions } from './CommonjsBundle';
import getFilesProcessor, { IGetFilesOptions } from './GetFiles';
import writeFilesProcessor, { IWriteFilesOptions } from './WriteFiles';
import middlewareProcessor, { IMiddlewareOptions } from './Middleware';
import sassBundleProcessor, { ISassBundleOptions } from './SassBundle';
import livereloadProcessor, { ILivereloadOptions } from './Livereload';
import sharpProcessor, { ISharpOptions } from './Sharp';

import { TProcessorGenerator } from '../typings';

type TProcessorName<T extends string> = { processor?: T }

export type TProcessorOptions = {
	'commonjs-bundle': ICommonjsBundleOptions & TProcessorName<'commonjs-bundle'>
	'get-files': IGetFilesOptions & TProcessorName<'get-files'>
	'write-files': IWriteFilesOptions & TProcessorName<'write-files'>
	'middleware': IMiddlewareOptions & TProcessorName<'middleware'>
	'sass-bundle': ISassBundleOptions & TProcessorName<'sass-bundle'>
	'livereload': ILivereloadOptions & TProcessorName<'livereload'>
	'sharp': ISharpOptions & TProcessorName<'sharp'>
}

export const processors: { [key in keyof TProcessorOptions]: TProcessorGenerator<TProcessorOptions[key]> } = {
	'commonjs-bundle': commonjsBundleProcessor,
	'get-files': getFilesProcessor,
	'write-files': writeFilesProcessor,
	'middleware': middlewareProcessor,
	'sass-bundle': sassBundleProcessor,
	'livereload': livereloadProcessor,
	'sharp': sharpProcessor
}
