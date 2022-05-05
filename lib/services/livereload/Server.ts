import { connection, Message } from 'websocket';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFileSync } from 'fs';
import { parse as parseUrl } from 'url';
import path from 'path';
import _ from 'lodash';

import { buildLogger } from '../Console';
import { livereloadService } from './Service';

/*----------  Types  ----------*/

import { ILivereloadService, TLivereloadCommand } from '../../typings';

type TWebSocketMessageBase = { command: string }
type TWebSocketServerCommandHandler<T> = (connection: connection, message: T) => void

interface IWebSocketRounter {
	info: TWebSocketServerCommandHandler<TWebSocketMessageBase>
	hello: TWebSocketServerCommandHandler<TWebSocketMessageBase & { protocols: string[] }>
	forward: TWebSocketServerCommandHandler<TWebSocketMessageBase & { payload: TLivereloadCommand }>
}

/*----------  Module deps  ----------*/

const livereloadJsFile = readFileSync(path.resolve(__dirname, '../../../../assets/livereload.min.js'));
const logger = buildLogger('Livereload', 'gray');
const { wsServer } = livereloadService;

const httpHandler = ({ url, method }: IncomingMessage, res: ServerResponse) => {
	const { pathname } = parseUrl(url || '');
	
	if (method === 'GET' && pathname === '/livereload.js') {
		res.writeHead(200, { 'Content-Type': 'text/javascript' });
		return res.end(livereloadJsFile.toString());
	}

	logger.error('HTTP Server can\'t resolve'.yellow, `"${method}" ${pathname}`);
	
	res.writeHead(404);
	res.end();
}

const httpServer = createServer(httpHandler);
wsServer.mount({ httpServer });

const callServerCommand: ILivereloadService['callCommand'] = (command, payload) => {
	wsServer.connections.forEach(connection => connection.sendUTF(JSON.stringify(Object.assign({ command }, payload))));
}

const webSocketCommandHandlers: IWebSocketRounter = {
	info: () => {},
	forward: ({}, message) => callServerCommand(message.payload.command, message.payload),
	
	hello: connection => {
		connection.sendUTF(JSON.stringify({
			serverName: 'n1k1t\'s livereload',
			command: 'hello',
			protocols: [
				'http://livereload.com/protocols/official-7',
				'http://livereload.com/protocols/official-8',
				'http://livereload.com/protocols/official-9',
				'http://livereload.com/protocols/2.x-origin-version-negotiation',
				'http://livereload.com/protocols/2.x-remote-control'
			]
		}));
	},
};

const webSocketMessageHandler = (connection: connection, message: Message) => {
	if (message.type !== 'utf8') {
		return null;
	}
	
	try {
		const payload = JSON.parse(message.utf8Data) as TWebSocketMessageBase & any;
		const command = <keyof IWebSocketRounter>payload.command;
		
		if (webSocketCommandHandlers[command] === undefined) {
			logger.error('WebSocket server can\'t find any resolver for:'.yellow, '\n', message.utf8Data);
			return connection.sendUTF(JSON.stringify({ message: 'Command not found' }));
		}

		webSocketCommandHandlers[command](connection, payload);
	} catch(error) {
		logger.error(
			'WebSocket server can\'t resolve message:'.red,
			'\n',
			message.utf8Data,
			'\n',
			_.get(error, 'message', error) || 'unknown', 
		);
	}
}

/*----------  Exports  ----------*/

export const handleServerConnect = (port: number) => {
	Object.assign(livereloadService, <ILivereloadService>{
		port,
		using: 'server',

		callCommand: callServerCommand,
		reloadPage: () => callServerCommand('reload', { path: '/' }),
		applyCss: filePath => callServerCommand('reload', { path: filePath, liveCSS: true })
	});

	httpServer.listen(port, () => logger.info('Server has been started on'.green, String(port).green.bold));
	wsServer.on('request', request => {
		const connection = request.accept();
		connection.on('message', message => webSocketMessageHandler(connection, message));
	});
}
