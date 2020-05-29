import { Page } from './Page'
import { el, myRequest, isEmpty } from '../util/util'

export let Project = new Page({
  tpl: require('../views/project.html'),
  async mounted(_cont, route) {
    let ProjectList = el('projectList')

    console.log('init project')
    try {
      let data = await myRequest('Project/describeProjects', {
        Category: 'VIDEO_EDIT',
      })
      console.log('initL', data)
      if (data.Code === 0) {
        data.Data.ProjectInfoSet.forEach(
          (item: { Signature: string; Name: string; ProjectId: string }) => {
            let LIitem = document.createElement('LI')
            LIitem.innerHTML = item.Name
            LIitem.setAttribute('data-sign', item.Signature)
            LIitem.setAttribute('data-pid', item.ProjectId)
            ProjectList.append(LIitem)
          }
        )

        ProjectList.addEventListener('click', (event) => {
          let srcEl = event.srcElement as HTMLElement
          let sign = srcEl.getAttribute('data-sign')
          let pid = srcEl.getAttribute('data-pid')
          route.goto('editor', {
            pid,
            Signature: sign,
          })
        })

        let pform = el('projectForm')

        pform.addEventListener('submit', async (event) => {
          console.log('project list')
          console.log(event)
          let keys = ['Name', 'Category', 'AspectRatio']
          let params: any = {}
          for (let i = 0; i < keys.length; ++i) {
            let result = (pform as any)[keys[i]]
            if (isEmpty(result.value)) {
              alert(`${keys[i]} 不能为空 `)
              return
            } else {
              params[keys[i]] = result.value
            }
          }
          let data = await myRequest('Project/createProject', params)
          console.log('createProject', data)
          if (data.Code === 0) {
            route.goto('editor', {
              pid: data.Data.ProjectId,
              Signature: data.Data.Signature,
            })
          }
        })
        return
      }
      throw new Error('get project list error')
    } catch (err) {
      console.log('err:', err)
      route.goto('')
    }
  },
})
