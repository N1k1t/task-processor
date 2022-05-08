import { Logger } from '../models';
export declare type TObject<T = unknown> = {
    [key: string]: T;
};
export declare type TFn<A extends unknown[], T = void> = (...args: A) => T;
export declare type TValueOf<T> = T[keyof T];
export declare type TWriteable<T> = {
    -readonly [K in keyof T]: T[K];
};
export declare type TColoredMessage = ((() => string) | string);
export interface ILogger extends Logger {
}
