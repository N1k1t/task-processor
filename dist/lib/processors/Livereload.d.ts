import { TProcessorGenerator } from '../typings';
export declare type TLivereloadAction = 'reload' | 'inject';
export interface ILivereloadOptions {
    action?: TLivereloadAction;
}
declare const handler: TProcessorGenerator<ILivereloadOptions>;
export default handler;
