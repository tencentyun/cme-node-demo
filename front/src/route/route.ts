import { Page } from '../pages/Page'

function parseQuery(queryStr: string) {
  let map: any = {}
  queryStr.split('&').forEach((item) => {
    let [name, val] = item.split('=')
    map[name] = decodeURIComponent(val)
  })
  return map
}
export class Router {
  /**
   *
   * @param opts
   *  @param container 响应路由的容器
   */
  private container!: HTMLElement
  constructor(opts: { container: HTMLElement }) {
    location.hash
    this.container = opts.container
  }
  mount() {
    let result = location.hash
    this.syncView(result)
    addEventListener('hashchange', () => {
      let result = location.hash
      this.syncView(result)
    })
  }
  routeMap: Map<string, Page> = new Map()
  add(name: string, page: Page) {
    this.routeMap.set(name, page)
  }
  syncView(originHash: string) {
    originHash = originHash.replace('#', '')
    let [routeName, paramStr] = originHash.split('?')
    console.log('paramStr:', paramStr)
    if (routeName === '') {
      routeName = '/'
    }
    let query = {}
    if (paramStr) {
      query = parseQuery(paramStr)
    }
    let page = this.routeMap.get(routeName)

    console.log('syncView', routeName, page)
    if (page) {
      page.render(this.container, this, query)
    }
  }
  goto(name: string, param?: any) {
    let queryStrs: string[] = []
    if (param) {
      for (let p in param) {
        queryStrs.push(`${p}=${encodeURIComponent(param[p])}`)
      }
    }
    console.log('goto:', param)
    location.hash = `${name}${queryStrs.length ? '?' + queryStrs.join('&') : ''}`
  }
}
