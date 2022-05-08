/// <reference types="node" />
import { ParsedPath } from 'path';
import { TWriteable } from '../typings';
export default class File implements ParsedPath {
    readonly base: string;
    readonly root: string;
    readonly dist: ParsedPath & TWriteable<Pick<File, 'path' | 'content'>>;
    private source;
    constructor(filePath: string, content: string | Buffer);
    get path(): string;
    get name(): string;
    get dir(): string;
    get ext(): string;
    get content(): string | Buffer;
    setContent(value: File['content']): File;
    setExt(value: File['ext']): File;
    setPath(value: File['path']): File;
    setName(value: File['name']): File;
    insert({ dir, name, ext }: Partial<Pick<File, 'dir' | 'name' | 'ext'>>): File;
}
