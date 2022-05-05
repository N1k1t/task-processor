import { TColoredMessage } from '../typings';
export declare class ProcessorError extends Error {
    header: TColoredMessage;
    constructor(header: TColoredMessage, errorMessage?: string);
}
