import { Page } from '../pages/Page';
export declare class Router {
    /**
     *
     * @param opts
     *  @param container 响应路由的容器
     */
    private container;
    constructor(opts: {
        container: HTMLElement;
    });
    mount(): void;
    routeMap: Map<string, Page>;
    add(name: string, page: Page): void;
    syncView(originHash: string): void;
    goto(name: string, param?: any): void;
}
