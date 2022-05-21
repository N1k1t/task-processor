import path from 'path';
import _ from 'lodash';

/*----------  Types  ----------*/

import { ParsedPath } from 'path';
import { TWriteable } from '../typings';

/*----------  Exports  ----------*/

export default class File implements ParsedPath {
	public readonly base: string
	public readonly root: string

	public readonly dist: ParsedPath & TWriteable<Pick<File, 'path' | 'content'>>
	private source: ParsedPath & TWriteable<Pick<File, 'content'>>

	constructor(filePath: string, content: string | Buffer) {
		const source = path.parse(filePath);

		Object.assign(this, _.pick(source, ['base', 'root']), { source, dist: source });
		Object.assign(this.source, { content });
	}

	public get path(): string {
		return this.dist.path || path.join(this.dir, `${this.name}${this.ext}`);
	}
	public get name(): string {
		return this.dist.name || this.source.name;
	}
	public get dir(): string {
		return this.dist.dir || this.source.dir;
	}
	public get ext(): string {
		return this.dist.ext || this.source.ext;
	}
	public get content(): string | Buffer {
		return this.dist.content || this.source.content;
	}

	public setContent(value: File['content']): File {
		this.dist.content = value;
		return this;
	}

	public setExt(value: File['ext']): File {
		this.dist.ext = value[0] === '.' ? value : `.${value}`;
		return this;
	}
	public setPath(value: File['path']): File {
		this.dist.path = value;
		return this;
	}
	public setName(value: File['name']): File {
		this.dist.name = value;
		return this;
	}
	public setDir(value: File['dir']): File {
		this.dist.dir = value;
		return this;
	}

	public assign({ dir, name, ext }: Partial<Pick<File, 'dir' | 'name' | 'ext'>>): File {
		name && this.setName(name);
		dir && this.setDir(dir);
		ext && this.setExt(ext);

		return this;
	}
}
