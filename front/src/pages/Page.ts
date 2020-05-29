import { Router } from '../route/route'

type mountedFn = (container: HTMLElement, route: Router, query: any) => void

export class Page {
  tpl: string
  mounted!: mountedFn
  constructor(options: { tpl: string; mounted: mountedFn }) {
    this.tpl = options.tpl
    this.mounted = options.mounted
  }
  render(container: HTMLElement, route: Router, query: any) {
    container.innerHTML = this.tpl
    this.mounted && this.mounted(container, route, query)
  }
}
