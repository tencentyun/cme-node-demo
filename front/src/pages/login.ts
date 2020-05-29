import { Page } from './Page'
import { myRequest, el } from '../util/util'

export let Login = new Page({
  tpl: require('../views/login.html'),
  mounted(_con, route) {
    let userBtn = el('userLogin')
    userBtn!.addEventListener('click', () => {
      let val = (el('user_name') as any).value
      if (val.replace(/\s/g, '') === '') {
        alert('名字不能为空')
        return
      }
      myRequest('User/login', {
        Account: val,
      }).then((data) => {
        if (data.Code === 0) {
          alert('登录成功')
          route.goto('projects')
        }
      })
    })
  },
})
