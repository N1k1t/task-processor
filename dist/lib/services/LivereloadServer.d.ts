declare type TLivereloadCommand = {
    command: 'reload' | 'alert';
    path?: string;
    liveCSS?: boolean;
};
interface ILivereloadService {
    readonly port: number;
    readonly type: 'server' | 'client';
    readonly callCommand: (name: TLivereloadCommand['command'], payload: Omit<TLivereloadCommand, 'command'>) => void;
    readonly reloadPage: () => void;
    readonly applyCss: (filePath: string) => void;
}
export declare const livereloadService: ILivereloadService;
export declare const useLivereloadServer: import("../typings").TFn<[], void> | (({ port }?: {
    port?: number | undefined;
}) => Promise<unknown>);
export {};
