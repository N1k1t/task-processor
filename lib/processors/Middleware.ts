import { TProcessorGenerator, IProcessorRunnerContext } from '../typings';
import { ProcessorError } from '../errors';

export interface IMiddlewareOptions {
	fn: (context: IProcessorRunnerContext) => void | Promise<void>
}

const handler: TProcessorGenerator<IMiddlewareOptions> = () => async (context, { fn }) => {
	try {
		const result = fn(context);

		if (result instanceof Promise) {
			await result;
		}
	} catch(error: any) {
		throw new ProcessorError(error?.message ?? 'unknown');
	}
}

export default handler
