import _ from 'lodash';
import { livereloadService, buildLogger, queueThread } from '../services';
import { runTask } from './TaskWorker';
import config from '../../config';

/*----------  Types  ----------*/

import { 
	ITask, 
	ITaskHandlerDetails, 
	TProcessorThreadContext, 
	TObject 
} from '../typings';

type TTaskHandlerResult = Promise<(TProcessorThreadContext | null)[] | null>

/*----------  Module deps  ----------*/

const logger = buildLogger(`Master`, 'green');

const handleLivereloadTask = ({ files, livereload: { action } }: TProcessorThreadContext) => {
	switch (action) {
		case 'reload': return livereloadService.reloadPage();
		case 'inject': return files
			.filter(file => file.result.ext === '.css')
			.forEach(file => livereloadService.applyCss(file.result.path));
	}
}

const prepareTaskToThread = (task: ITask): TObject => JSON.parse(JSON.stringify(task));

const processTask = async (task: ITask, details: ITaskHandlerDetails): Promise<TProcessorThreadContext | null> => {
	const context = config.useThreads
		? await queueThread<TProcessorThreadContext | null>(worker => worker.runTask(<any>prepareTaskToThread(task), details))
		: await runTask(task, details);

	if (context === null) {
		return null;
	}

	if (context.livereload.enabled) {
		handleLivereloadTask(context);
	}

	return context;
}

/*----------  Exports  ----------*/

export const handleTask = async (task: ITask, details: ITaskHandlerDetails): TTaskHandlerResult => {
	const timestamp = Date.now();
	const loggerHeader = ['Task'.gray, `"${task.name}"`].join(' ');

	const logTaskHasBeenFailed = () => logger.info(loggerHeader, 'has been failed'.red, '\n');
	const logTaskHasBeenDone = () => logger.info(loggerHeader, 'has been done in'.green, `${((Date.now() - timestamp) / 1000).toFixed(2)}s`.green.bold, '\n');

	if ((task.use || []).length === 0) {
		logger.error('Task'.gray, `"${task.name}"`, 'hasn\'t any processors in "use"'.yellow);
		return null;
	}
	if (Array.isArray(details.addFiles?.path) && details.addFiles?.path.length === 0) {
		logger.error('Task'.gray, `"${task.name}"`, 'hasn\'t any files to add"'.yellow);
		return null;
	}

	logger.info(loggerHeader, 'has been started'.gray);

	if (details.addFiles === undefined) {
		const result = await processTask(task, details);
		if (result === null) {
			logTaskHasBeenFailed()
			return null;
		}

		logTaskHasBeenDone();
		return [result];
	}

	const results = await Promise.all(_.flatten([details.addFiles?.path ?? []]).map(async (path) => {
		return processTask(task, _.set(_.cloneDeep(details), 'addFiles.path', path))
	}));

	if (results.every(result => result === null)) {
		logTaskHasBeenFailed();
		return null;
	}

	logTaskHasBeenDone();
	return results;
}
