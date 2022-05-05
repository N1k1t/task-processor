import { TProcessorGenerator } from '../typings';
export interface IGetFilesOptions {
    path: string | string[];
}
declare const handler: TProcessorGenerator<IGetFilesOptions>;
export default handler;
