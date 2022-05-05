import { Options } from 'browserify';
import { TProcessorGenerator } from '../typings';
import { IOptions } from 'minimatch';
export interface ICommonjsBundleOptions extends Omit<Options, 'entries'> {
    plugins?: [string, IOptions?][];
}
declare const handler: TProcessorGenerator<ICommonjsBundleOptions>;
export default handler;
