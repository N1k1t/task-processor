import _ from 'lodash';
import { ProcessorRunnerContext } from '../models';

/*----------  Exports  ----------*/

export const buildProcessorRunnerContext = (): ProcessorRunnerContext => {
	const context = new ProcessorRunnerContext();

	return Object.assign(context, {
		useLivereload: context.useLivereload.bind(context),
		convertToThread: context.convertToThread.bind(context)
	});
};
