export declare type TObject<T = unknown> = {
    [key: string]: T;
};
export declare type TFunc<A extends unknown[], T = void> = (...args: A) => T;
export declare type TValueOf<T> = T[keyof T];
