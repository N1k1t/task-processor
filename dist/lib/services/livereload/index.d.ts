export { livereloadService } from './Service';
/**
 * @description It starts the livereload server. If it already runs (in another process) that will create the client
 * @return void
 *
 * @param {Object} options 			- Livereload options
 * @param {number} [options.port] 	- Port of livereload server
 *
 * @example
 * ```js
 * import { registerCliTasks, useLivereloadServer } from '@n1k1t/task-processor';
 *
 * useLivereloadServer();
 *
 * registerCliTasks([
 *   {
 *     name: 'page-reload',
 *     use: [
 *       { processor: 'livereload', type: 'reload' }
 *     ]
 *   }
 * ]);
 * ```
*/
export declare const useLivereloadServer: import("../../typings").TFn<[], void> | (({ port }?: {
    port?: number | undefined;
}) => Promise<unknown>);
