type btnType = 'btn' | 'select'
export function createBtn(opts: {
  id: any
  handler: any
  text?: string
  type: btnType
  selectOptions?: { text: string; val: any }[]
}) {
  if (opts.type === 'btn') {
    let btn = document.createElement('button')
    btn.textContent = opts.text || ''
    btn.classList.add('d-btn')
    btn.addEventListener('click', opts.handler)
    btn.id = opts.id
    return btn
  }
  if (opts.type == 'select') {
    let select = document.createElement('select')
    select.classList.add('d-select')
    if (opts.selectOptions) {
      opts.selectOptions.forEach((item) => {
        let opt = document.createElement('option')
        opt.textContent = item.text
        opt.value = item.val
        select.appendChild(opt)
      })
    }
    select.addEventListener('select', opts.handler)
    select.id = opts.id
    return select
  }
}

export function isLogin() {
  return /userId/.exec(document.cookie)
}

export function el(id: string) {
  return document.getElementById(id)!
}
export function isEmpty(val: string) {
  return val.replace(/\s/g, '') === ''
}
let myhost = `//${window.location.host}`
function getRequestUrl(url: string) {
  return `${myhost}/${url}`
}

export async function myRequest(url: string, param: any) {
  try {
    let result = await fetch(getRequestUrl(url), {
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(param),
      method: 'POST',
    })
    let data = await result.json()
    return data
  } catch (err) {
    throw err
  }
}

export class Page {
  id: string
  el: HTMLElement
  init: (prarm?: any) => void
  constructor(id: string, el: HTMLElement, cb: () => void) {
    this.el = el
    this.id = id
    this.init = cb
  }
  show(param: any) {
    this.el.style.display = 'block'
    this.init && this.init(param)
  }
  hide() {
    this.el.style.display = 'none'
  }
}
export class PageManager {
  pageList: Page[] = []
  add(id: string, el: HTMLElement, cb: () => void) {
    this.pageList.push(new Page(id, el, cb))
  }
  go(id: string | number, params?: any) {
    if (typeof id === 'string') {
      for (let i = 0; i < this.pageList.length; ++i) {
        if (this.pageList[i].id === id) {
          this.pageList[i].show(params)
        } else {
          this.pageList[i].hide()
        }
      }
    } else {
      this.pageList.forEach((item) => {
        item.hide()
      })
      this.pageList[id].show(params)
    }
  }
}
type scene = 'important' | 'desc' | 'error'
export function print(scene: scene, ...arg: any) {
  let text = ''
  let colored = ''
  switch (scene) {
    case 'desc':
      text = '%c[test][DESC]'
      colored = 'color:#969200'
      console.log(text, colored, ...arg)
      break
    case 'important':
      text = '%c[test][IMPT]'
      colored = 'color:#795548'
      console.warn(text, colored, ...arg)
      break
    case 'error':
      text = '%c[test][ERROR]'
      colored = 'color:#ff0000'

      console.error(text, colored, ...arg)
      break
  }
}
