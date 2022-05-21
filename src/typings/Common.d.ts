import { Logger } from '../models';

export type TObject<T = unknown> = { [key: string]: T }
export type TFn<A extends unknown[], T = void> = (...args: A) => T
export type TValueOf<T> = T[keyof T]
export type TWriteable<T> = { -readonly [K in keyof T]: T[K] }

export type TColoredMessage = ((() => string) | string)

export interface ILogger extends Logger {}
