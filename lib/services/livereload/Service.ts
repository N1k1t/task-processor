import { server as WebSocketServer, client as WebSocketClient } from 'websocket';
import { buildLogger } from '../Console';

/*----------  Types  ----------*/

import { ILivereloadService } from '../../typings';

/*----------  Module deps  ----------*/

const logger = buildLogger('Livereload', 'gray');

const logServerWasNotStarted = () => logger.error(
	'Server wasn\'t started. Call'.red, 
	'useLivereloadServer'.white.bold, 
	'function in your project first'.red
)

/*----------  Exports  ----------*/

export const livereloadService: ILivereloadService = {
	port: 8080,
	using: 'server',

	wsServer: new WebSocketServer(),
	wsClient: new WebSocketClient(),

	callCommand: () => logServerWasNotStarted(),
	reloadPage: () => logServerWasNotStarted(),
	applyCss: () => logServerWasNotStarted()
}
