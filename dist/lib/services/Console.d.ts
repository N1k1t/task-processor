import 'colors';
import { ICliTask, TColoredMessage } from '../typings';
declare type TLoggerFn = (...messages: TColoredMessage[]) => void;
interface ILoggerBase {
    info: TLoggerFn;
    error: TLoggerFn;
    emptyLine: () => ILoggerBase;
}
interface ILoggerHelpers {
    useScope: (scope: string) => ILoggerBase;
}
export declare type TLogger<T = {}> = T & ILoggerBase;
export declare const useLineInterface: (tasks: ICliTask[], handler: (line: string) => void) => void;
export declare const printHello: () => void;
export declare const buildLogger: (title: string, color: string, hasTime?: boolean) => TLogger<ILoggerHelpers>;
export {};
