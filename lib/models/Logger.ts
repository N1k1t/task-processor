import _ from 'lodash';

/*----------  Types  ----------*/

import { TColoredMessage } from '../typings';

interface ILoggerConfig {
	hasTime?: boolean
	scope?: string | null
}

/*----------  Exports  ----------*/

export default class Logger {
	constructor(
		private title: string,
		private color: keyof String,
		private config: ILoggerConfig = {}
	) {
		Object.assign(this.config, _.defaults(this.config, {
			hasTime: true,
			scope: null
		}));
	}

	public info(...messages: TColoredMessage[]): void {
		return console.log(...[
			this.config.hasTime ? new Date().toLocaleTimeString().gray : null,
			String(` [${this.title}]`.padEnd(15, ' '))[this.color],
			this.config.scope && `<${this.config.scope}>`[this.color],
			messages.join(' ')
		].filter(segment => segment !== null));
	}

	public error(...messages: TColoredMessage[]): void {
		return console.error(...[
			this.config.hasTime ? new Date().toLocaleTimeString().gray : null,
			String(` [${this.title}]`.padEnd(15, ' '))[this.color],
			this.config.scope && `<${this.config.scope}>`[this.color],
			'Error:'.red,
			messages.join(' ')
		].filter(segment => segment !== null));
	}

	public emptyLine(): Logger {
		console.log('');
		return this;
	}

	public useScope(scope: string): Logger {
		this.config.scope = scope;
		return this;
	}
}
