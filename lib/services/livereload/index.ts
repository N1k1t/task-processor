import { check as checkPort } from 'tcp-port-used';
import _ from 'lodash';

import { buildLogger } from '../Console';
import { useInMainThread } from '../Thread';
import { handleServerConnect } from './Server';
import { handleClientConnect } from './Client';

/*----------  Module deps  ----------*/

const logger = buildLogger('Livereload', 'gray');

/*----------  Exports  ----------*/

export { livereloadService } from './Service';

export const useLivereloadServer = useInMainThread(async ({ port = 35729 } = {}) => {
	const isPortAlreadyUsed = await checkPort(port);
	if (isPortAlreadyUsed) {
		logger.info('There\'s something that uses port'.yellow, String(port).yellow.bold);
		logger.info('Trying to connect as client...'.gray);

		return handleClientConnect(port);
	}

	return handleServerConnect(port);
});