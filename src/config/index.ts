import _ from 'lodash';

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

export default {
	assign: (values: Partial<typeof config>) => Object.assign(config, values),
	set: <T extends keyof typeof config>(key: T, value: typeof config[T]) => _.set(config, String(key), value),
	get: <T extends keyof typeof config>(key: T): typeof config[T] => _.get(config, String(key))
}
