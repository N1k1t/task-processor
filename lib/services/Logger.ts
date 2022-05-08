import 'colors';
import { Logger } from '../models';

/*----------  Exports  ----------*/

export const buildLogger = (title: string, color: keyof String, hasTime: boolean = true): Logger => {
	return new Logger(title, color, { hasTime });
}
