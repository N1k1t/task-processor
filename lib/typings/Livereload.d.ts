import { server, client } from 'websocket';

export type TLivereloadAction = 'reload' | 'inject'
export type TLivereloadCommandName = 'reload' | 'alert'

export type TLivereloadCommand = {
	command: TLivereloadCommandName
	path?: string
	liveCSS?: boolean
}

export interface ILivereloadService {
	readonly port: number
	readonly using: 'server' | 'client'

	readonly wsServer: server
	readonly wsClient: client

	readonly callCommand: (command: TLivereloadCommandName, payload: Omit<TLivereloadCommand, 'command'>) => void
	readonly reloadPage: () => void
	readonly applyCss: (filePath: string) => void
}