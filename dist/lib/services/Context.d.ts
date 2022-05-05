import { IProcessorRunnerContext, TProcessorThreadContext } from '../typings';
export declare const buildContext: () => IProcessorRunnerContext;
export declare function toThreadContext(context: IProcessorRunnerContext): TProcessorThreadContext;
