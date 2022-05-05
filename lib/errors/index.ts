import { TColoredMessage } from '../typings'

export class ProcessorError extends Error {
	constructor(public header: TColoredMessage, errorMessage?: string) {
		super([
			header,
			errorMessage && `\n${'---------------------'.red}\n${errorMessage}\n${'---------------------'.red}`
		].filter(segment => segment !== undefined).join(' '));
	}
}
