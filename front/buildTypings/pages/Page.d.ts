import { Router } from '../route/route';
declare type mountedFn = (container: HTMLElement, route: Router, query: any) => void;
export declare class Page {
    tpl: string;
    mounted: mountedFn;
    constructor(options: {
        tpl: string;
        mounted: mountedFn;
    });
    render(container: HTMLElement, route: Router, query: any): void;
}
export {};
