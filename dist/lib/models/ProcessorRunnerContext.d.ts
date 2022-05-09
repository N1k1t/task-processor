import File from './File';
import { TLivereloadAction, TProcessorThreadContext } from '../typings';
interface ILivereloadConfig {
    enabled: boolean;
    action: TLivereloadAction | null;
}
export default class ProcessorRunnerContext {
    readonly files: Set<File>;
    readonly livereload: ILivereloadConfig;
    useLivereload(action: TLivereloadAction): void;
    buildFile(filePath: File['path'], content: File['content']): File;
    convertToThread(): TProcessorThreadContext;
}
export {};
