declare type btnType = 'btn' | 'select';
export declare function createBtn(opts: {
    id: any;
    handler: any;
    text?: string;
    type: btnType;
    selectOptions?: {
        text: string;
        val: any;
    }[];
}): HTMLButtonElement | HTMLSelectElement | undefined;
export declare function isLogin(): RegExpExecArray | null;
export declare function el(id: string): HTMLElement;
export declare function isEmpty(val: string): boolean;
export declare function myRequest(url: string, param: any): Promise<any>;
export declare class Page {
    id: string;
    el: HTMLElement;
    init: (prarm?: any) => void;
    constructor(id: string, el: HTMLElement, cb: () => void);
    show(param: any): void;
    hide(): void;
}
export declare class PageManager {
    pageList: Page[];
    add(id: string, el: HTMLElement, cb: () => void): void;
    go(id: string | number, params?: any): void;
}
declare type scene = 'important' | 'desc' | 'error';
export declare function print(scene: scene, ...arg: any): void;
export {};
