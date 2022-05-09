import { Sharp, SharpOptions } from 'sharp';
import { TProcessorGenerator } from '../typings';
export interface ISharpOptions extends SharpOptions {
    pipeline?: (sharp: Sharp) => Sharp;
}
declare const handler: TProcessorGenerator<ISharpOptions>;
export default handler;
