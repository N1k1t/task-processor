import { TColoredMessage } from '../typings';
export default class ProcessorError extends Error {
    header: TColoredMessage;
    constructor(header: TColoredMessage, errorMessage?: string);
}
