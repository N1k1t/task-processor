import { ICommonjsBundleOptions } from './CommonjsBundle';
import { IGetFilesOptions } from './GetFiles';
import { IWriteFilesOptions } from './WriteFiles';
import { IMiddlewareOptions } from './Middleware';
import { ISassBundleOptions } from './SassBundle';
import { ILivereloadOptions } from './Livereload';
import { ISharpOptions } from './Sharp';
import { TProcessorGenerator } from '../typings';
declare type TProcessorName<T extends string> = {
    processor?: T;
};
export declare type TProcessorOptions = {
    'commonjs-bundle': ICommonjsBundleOptions & TProcessorName<'commonjs-bundle'>;
    'get-files': IGetFilesOptions & TProcessorName<'get-files'>;
    'write-files': IWriteFilesOptions & TProcessorName<'write-files'>;
    'middleware': IMiddlewareOptions & TProcessorName<'middleware'>;
    'sass-bundle': ISassBundleOptions & TProcessorName<'sass-bundle'>;
    'livereload': ILivereloadOptions & TProcessorName<'livereload'>;
    'sharp': ISharpOptions & TProcessorName<'sharp'>;
};
export declare const processors: {
    [key in keyof TProcessorOptions]: TProcessorGenerator<TProcessorOptions[key]>;
};
export {};
