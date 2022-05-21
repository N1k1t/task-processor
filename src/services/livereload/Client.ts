import { connection } from 'websocket';
import { check as checkPort } from 'tcp-port-used';
import _ from 'lodash';

import config from '../../config';
import { buildLogger } from '../Logger';
import { livereloadService } from './Service';
import { handleServerConnect } from './Server';

/*----------  Types  ----------*/

import { ILivereloadService } from '../../typings';

/*----------  Module deps  ----------*/

const logger = buildLogger('Livereload', 'gray');
const { wsClient, wsServer } = livereloadService;

const handleClientDisconnect = async () => {
	const { port } = livereloadService;
	const isPortAlreadyUsed = await checkPort(port);
	
	if (isPortAlreadyUsed) {
		return connectClient(port);
	}

	logger.info('Can\'t find any servers on'.yellow, String(port).yellow.bold);
	logger.info('Trying to start up server localy...'.gray);

	return new Promise(resolve => {
		wsServer.once('request', () => setTimeout(() => resolve(null), config.get('livereloadReconnectDelayMs')));
		return handleServerConnect(port);
	});
}

/*----------  Exports  ----------*/

export const callClientCommand = (connection: connection): ILivereloadService['callCommand'] => async (command, payload) => {	
	if (!connection.connected) {
		await handleClientDisconnect();
		return livereloadService.callCommand(command, payload);
	}

	connection.sendUTF(JSON.stringify({ 
		command: 'forward', 
		payload: { command, ...payload }
	}));
}

export const connectClient = (port: number) => new Promise(resolve => {
	wsClient.once('connect', () => resolve(null));
	wsClient.connect(`ws://localhost:${port}/`);
})

export const handleClientConnect = async (port: number) => {
	wsClient.on('connect', connection => {
		logger.info('Connected as client'.green);

		Object.assign(livereloadService, <ILivereloadService>{
			port,
			using: 'client',

			callCommand: callClientCommand(connection),
			reloadPage: () => callClientCommand(connection)('reload', { path: '/' }),
			injectCss: filePath => callClientCommand(connection)('reload', { path: filePath, liveCSS: true }),
			injectImg: filePath => callClientCommand(connection)('reload', { path: filePath, liveImg: true })
		});
	});

	wsClient.on('connectFailed', error => logger.error('Client connect has been failed', error.message));
	return connectClient(port);
}
