import _ from 'lodash';

/*----------  Typings  ----------*/

type TConfig = typeof config
type TConfigKeys = keyof TConfig

/*----------  Module deps  ----------*/

const config = {
	defaultIgnoredDirs: ['node_modules/', '.git/'],
	livereloadReconnectDelayMs: 1000,
	sharpImageFormats: [
		'.avif', '.dz', '.fits', '.gif', '.heif', '.input', '.jpeg',
		'.jpg', '.magick', '.openslide', '.pdf', '.png', '.ppm',
		'.raw', '.svg', '.tiff', '.tif', '.v', '.webp'
	],
	useThreads: false,
	execPath: 'unknown'
};

/*----------  Exports  ----------*/

export default {
	assign: (values: Partial<TConfig>) => Object.assign(config, values),
	set: <T extends TConfigKeys>(key: T, value: TConfig[T]) => _.set(config, String(key), value),
	get: <T extends TConfigKeys>(key: T): TConfig[T] => _.get(config, String(key))
}
