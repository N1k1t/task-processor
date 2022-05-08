import { watch } from 'chokidar';
import _ from 'lodash';
import path from 'path';

import { buildLogger } from './Logger';
import config from '../../config';

/*----------  Types  ----------*/

import { IBackgroundTask } from '../typings';

/*----------  Module deps  ----------*/

const logger = buildLogger('Watcher', 'magenta');

/*----------  Exports  ----------*/

export const setupTaskWatcher = (task: IBackgroundTask, handler: (filePath?: string) => void): void => {
	const watchMatches: string | string[] = _.get(task.watch, 'match', task.watch);
	const ignoreList = _.flatten([_.get(task.watch, 'ignore', [])]);

	if (watchMatches === undefined) {
		return logger.error('Not found any watch matches for task'.red, `"${task.name}"`.cyan.bold);
	}

	const watcher = watch(watchMatches, { ignored: config.defaultIgnoredDirs.concat(ignoreList) });

	logger.info('Task'.gray, `"${task.name}"`.cyan.bold, 'is watching for:'.gray, _.flatten([watchMatches]).join());

	watcher.on('change', filePath => {
		logger.info('File'.gray, `"${filePath}"`.bold, 'has been changed'.gray);
		
		const pathOption = _.get(task.watch, 'triggerOnly', false) ? undefined : path.normalize(filePath);
		return handler(pathOption);
	});
}
