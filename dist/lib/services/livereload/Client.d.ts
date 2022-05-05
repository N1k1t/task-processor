import { connection } from 'websocket';
import { ILivereloadService } from '../../typings';
export declare const callClientCommand: (connection: connection) => ILivereloadService['callCommand'];
export declare const connectClient: (port: number) => Promise<unknown>;
export declare const handleClientConnect: (port: number) => Promise<unknown>;
