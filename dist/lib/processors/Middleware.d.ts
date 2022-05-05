import { TProcessorGenerator, IProcessorRunnerContext } from '../typings';
export interface IMiddlewareOptions {
    fn: (context: IProcessorRunnerContext) => void | Promise<void>;
}
declare const handler: TProcessorGenerator<IMiddlewareOptions>;
export default handler;
