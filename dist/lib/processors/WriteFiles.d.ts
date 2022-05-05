import { TProcessorGenerator } from '../typings';
export interface IWriteFilesOptions {
    dir?: string;
    name?: string;
    ext?: string;
}
declare const handler: TProcessorGenerator<IWriteFilesOptions>;
export default handler;
