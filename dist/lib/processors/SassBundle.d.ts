import { StringOptions } from 'sass';
import { TProcessorGenerator } from '../typings';
export interface ISassBundleOptions extends Omit<StringOptions<'async'>, 'data' | 'loadPaths'> {
    paths?: string[];
}
declare const handler: TProcessorGenerator<ISassBundleOptions>;
export default handler;
