import _ from 'lodash';
import { threadId } from 'worker_threads';
import { expose } from 'threads/worker'

import { buildLogger } from './Logger';
import { processors } from '../processors';
import { buildContext } from './Context';
import { loadTasksContext, getTaskContext, isMainThread } from './Thread';

/*----------  Types  ----------*/

import { 
	IProcessorRunnerContext,
	ITaskHandlerDetails,
	TProcessorName,
	ITaskHandler,
	ITask
} from '../typings';

/*----------  Module deps  ----------*/

const logger = buildLogger(isMainThread ? 'Worker' : `Worker #${threadId}`, 'cyan');
const breakSymbol = Symbol('Break');

const addFilesToContext = async (task: ITask, details: ITaskHandlerDetails, runnerContext: IProcessorRunnerContext) => {
	if (details.addFiles?.path === undefined) {
		return null;
	}

	return processors['get-files']({ task, details, logger: logger.useScope('get-files') })(runnerContext, {
		path: details.addFiles.path
	});
}


/*----------  Exports  ----------*/

export const runTask: ITaskHandler['runTask'] = async (inputedTask, details) => {
	loadTasksContext(details.config.execPath);

	const task = getTaskContext(details.type, inputedTask);
	const runnerContext = buildContext();
	
	const addFilesResult = await addFilesToContext(task, details, runnerContext).catch(error => {
		logger.error(error.message);
		return breakSymbol;
	});

	if (addFilesResult === breakSymbol) {
		return null;
	}

	for (const { processor: name, ...options } of task.use) {
		if (processors[<TProcessorName>name] === undefined) {
			logger.error(`Processor "${name}" is not exists`);
			return null;
		}

		const processorLogger = logger.useScope(<TProcessorName>name);
		const processorContext = { task, details, logger: processorLogger };
		const result = await processors[<TProcessorName>name](processorContext)(runnerContext, <any>options)
			.catch(error => {
				processorLogger.error(error.message);
				return breakSymbol;
			});

		if (result === breakSymbol) {
			return null;
		}
	}

	return runnerContext.convertToThread();
}

/*----------  Thread deps  ----------*/

if (!isMainThread) {
	const workerModule: ITaskHandler = { runTask };
	expose(<any>workerModule);
}
