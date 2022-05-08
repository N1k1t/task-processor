import { TColoredMessage } from '../typings';
interface ILoggerConfig {
    hasTime?: boolean;
    scope?: string | null;
}
export default class Logger {
    private title;
    private color;
    private config;
    constructor(title: string, color: keyof String, config?: ILoggerConfig);
    info(...messages: TColoredMessage[]): void;
    error(...messages: TColoredMessage[]): void;
    emptyLine(): Logger;
    useScope(scope: string): Logger;
}
export {};
