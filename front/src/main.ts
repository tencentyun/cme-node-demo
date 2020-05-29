import { createBtn, isLogin, PageManager, isEmpty, el, Page, myRequest, print } from './util/util'
import * as vodjs from 'vod-js-sdk-v6'
import { Project } from './pages/project'
import { Router } from './route/route'
import { Login } from './pages/login'
import { Editor } from './pages/Editor'

/**
 * demo 入口文件
 */
let global: any = window
let init: CME.init = global.CME.init
const CME = global.CME as any
let myhost = `//${window.location.host}`

let hideUiList: string[] = []
let container = el('container')!
let editorWrapper = el('eidtor-wrapper')!
let uiWrapper = el('ui-wrapper')!
let msgBox = el('message')!

function watchTask(TaskId: string) {
  myRequest('Project/describeTaskDetail', {
    TaskId: TaskId,
  }).then((data) => {
    msgBox.textContent = `导出中:${data.Data.Progress}% ,状态${data.Data.Status}`
    if (Number(data.Data.Progress) < 100 || data.Data.Status === 'PROCESSING') {
      setTimeout(() => {
        watchTask(TaskId)
      }, 2 * 1000)
    }
    console.log(data)
  })
}

function initedCme(cmd: CME.CmeInstance) {
  let exporting = false
  ;(window as any).cme = cmd
  cmd.on('Error', (arg) => {
    console.log('Error:', arg)
  })
  cmd.on('Editor:MoreResourceBtn:Click', () => {
    msgBox.textContent = '点击更多资源'
  })
  cmd.on('Editor:UploadBtn:Click', () => {
    msgBox.textContent = '点击上传'
  })
  cmd.on('Editor:MoreResourceBtn:Click', () => {
    console.log('第二个函数')
  })

  cmd.on('Header:BackBtn:Click', () => {
    msgBox.textContent = '点击返回'
  })
  cmd.on('Editor:ExportBtn:Click', () => {
    if (exporting) {
      msgBox.textContent = '正在导出...请稍后再试'
      return
    }
    exporting = true
    msgBox.textContent = '正在导出...'

    myRequest('Project/exportVideoEditProject', {
      ProjectId: (el('pid') as any).value,
    })
      .then((data) => {
        watchTask(data.Data.TaskId)
      })
      .catch((err) => {
        msgBox.textContent = '导出失败，请重试'
        console.log(err)
        exporting = false
      })
  })
}

const enum PageIndex {
  userLogin,
  projectList,
  editor,
}

let cme: CME.CmeInstance | null = null
let UIManger = new PageManager()
let fnList = [
  {
    text: '初始化',
    click: () => {
      let signInput: any = document.getElementById('sign')
      if (signInput.value.replace(/\s+/, '') === '') {
        alert('请添入签名')
        return
      }
      if (!cme) {
        print('desc', '初始化 clicked')
        cme = init(container, {
          sign: signInput.value,
        })
        initedCme(cme)
        ;(window as any).myCme = cme
        msgBox.textContent = '正在初始化...'

        cme.on('Editor:Ready', () => {
          cme &&
            cme.send(
              'resetUI',
              {
                hideList: hideUiList,
              },
              () => {
                print('desc', 'done')
              }
            )
          msgBox.textContent = '初始化完成，等待交互'
          print('desc', 'iframe Ready')
        })
      } else {
        print('error', '已经初始化')
      }
    },
  },
  {
    text: '销毁',
    click: () => {
      if (cme) {
        cme.destroy()
        cme = null
        msgBox.textContent = '已经销毁对象'
        print('desc', '销毁 clicked')
      }
    },
  },
  {
    text: '导入素材',
    click: () => {
      if (cme) {
        let fid = (el('fid') as any).value
        myRequest('Project/importMediaToProject', {
          VodFileId: fid,
          ProjectId: (el('pid') as any).value,
        })
        // fetch()
        print('desc', '销毁 clicked')
      }
    },
  },
  {
    text: '刷新素材',
    click: () => {
      if (cme) {
        let fid = (el('fid') as any).value
        console.log('refresh material')
        cme.send(
          'refreshResources',
          {
            mids: [fid],
          },
          (data: any) => {
            // trackData.addTackItem()
            console.log('in demo', data)
            /**
             * 音频
             */
            //381921560306406981@Public@CME

            print('desc', 'done reset  成功:', hideUiList)
          }
        )
      }
    },
  },
  {
    text: '上传并导入素材',
    click: async () => {
      if (cme) {
        let uploaderFile = el('upload') as HTMLInputElement
        print('desc', '正在上传...')
        msgBox.textContent = '正在上传...'
        if (uploaderFile.files && uploaderFile.files.length) {
          console.log(uploaderFile.files)
          let file = uploaderFile.files[0]
          let res = await myRequest('upload/ApplyUploadSign', {})
          console.log('sign', res)
          try {
            let vodItem = new vodjs.default({
              getSignature: async () => {
                return res.Data.sign
              },
            })
            const uploader = vodItem.upload({
              videoFile: file,
            })
            let uploadDone = await uploader.done()
            let fileIdInput = el('fid') as any

            msgBox.textContent = '上传成功，正在添加素材，请稍后点击 刷新素材 按钮'
            let data = await myRequest('Project/importMediaToProject', {
              VodFileId: uploadDone.fileId,
              ProjectId: (el('pid') as any).value,
            })
            fileIdInput.value = data.Data.MaterialId

            let fid = (el('fid') as any).value
            console.log('refresh material')
            cme.send(
              'refreshResources',
              {
                mids: [fid],
              },
              () => {
                print('desc', 'done reset  成功:', hideUiList)
              }
            )
          } catch (err) {
            console.error(err)
          }
          // let  vodItem = new vodjs.default({
          //     getSignature: async () => {
          //       return sign
          //     },
          //   })
          //   const uploader = vodItem.upload({
          //     videoFile: opts.files[0],
          //   })
          //   const result: IUploadDone = await uploader.done()
        } else {
          alert('请先选择上传文件')
        }
      }
    },
  },
  {
    text: '同步数据',
    click: () => {
      if (cme) {
        cme.send('syncFusionData', () => {
          print('desc', 'done reset  成功:', hideUiList)
        })
      }
    },
  },
  // {
  //   text: '导出',
  //   click: () => {
  //     if (cme) {
  //       print('desc', '导出按钮 clicked')
  //     }
  //   },
  // },
]
type PageName = 'login' | 'project' | 'editor'

let ProjectList = el('projectList')

async function initProjectList() {
  console.log('init project')
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
  }
}

function initEditor(param: { Signature: string; ProjectId: string }) {
  ;(el('sign') as any).value = param.Signature
  ;(el('pid') as any).value = param.ProjectId
  fnList[0].click()
}

function initPage() {
  ProjectList.addEventListener('click', (event) => {
    let srcEl = event.srcElement as HTMLElement
    let sign = srcEl.getAttribute('data-sign')
    let pid = srcEl.getAttribute('data-pid')
    UIManger.go(PageIndex.editor, { Signature: sign, ProjectId: pid })
  })

  let nodeList = document.querySelectorAll('[data-page]')
  nodeList.forEach((item) => {
    let initFn: any
    let name = item.getAttribute('data-page') as PageName
    if (name === 'project') {
      initFn = initProjectList
    }
    if (name === 'editor') {
      initFn = initEditor
    }
    UIManger.add(name, item as HTMLElement, initFn)
  })
  isLogin() ? UIManger.go(PageIndex.projectList) : UIManger.go(PageIndex.userLogin)
}

function main() {
  let myRoute = new Router({
    container: el('app'),
  })
  let routeConfig = [
    {
      name: '/',
      page: Login,
    },
    {
      name: 'projects',
      page: Project,
    },
    {
      name: 'editor',
      page: Editor,
    },
  ]

  routeConfig.forEach((item) => {
    myRoute.add(item.name, item.page)
  })
  myRoute.mount()
  // initPage()
  addEventListener('message', (data) => {
    console.log('message', data)
  })
}

function initUiComponents() {
  let uiList = [
    { id: 'Editor:MoreResourceBtn', text: '更多资源按钮', checked: true },
    {
      id: 'Editor:ExportBtn',
      text: '导出按钮',
      checked: true,
    },
    {
      id: 'Header:BackBtn',
      text: '返回按钮',
      checked: true,
    },
    {
      id: 'Header:Logo',
      text: 'Logo',
      checked: true,
    },
    {
      id: 'Editor:UploadBtn',
      text: '上传按钮',
      checked: true,
    },
  ]

  let pform = el('projectForm')

  pform.addEventListener('submit', async (event) => {
    console.log('project list')
    console.log(event)

    /**
     * 
     *         createProjectReq.Name = params.Name
        createProjectReq.Category = params.Category
        createProjectReq.AspectRatio = params.AspectRatio
        createProjectReq.Platform = config.platform
        createProjectReq.ProjectName = params.ProjectName
        createProjectReq.ProjectDesc = params.ProjectDesc
     * 
     * 
     * 
     */
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
      UIManger.go(PageIndex.editor, data.Data)
    }
  })
  let userBtn = document.getElementById('userLogin')
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
        UIManger.go(PageIndex.projectList)
      }
    })
  })

  uiList.forEach((item) => {
    if (!item.checked) {
      hideUiList.push(item.id)
    }
  })
  print('important', hideUiList)

  uiList.forEach((item) => {
    let checkBox: any = document.createElement('INPUT')
    checkBox.setAttribute('type', 'checkbox')
    checkBox.value = item.id
    if (item.checked) {
      checkBox.setAttribute('checked', item.checked)
    }
    let label: any = document.createElement('LABEL')
    label.innerHTML = item.text
    uiWrapper.appendChild(checkBox)
    uiWrapper.appendChild(label)
  })

  uiWrapper.addEventListener('click', (event) => {
    let el = event.srcElement as any
    if (el && el.tagName === 'INPUT') {
      console.log(el.checked, el.value)
      if (el.checked) {
        hideUiList = hideUiList.filter((item) => item != el.value)
      } else {
        if (!hideUiList.includes(el.value)) {
          hideUiList.push(el.value)
        }
      }
      print('desc', hideUiList)
      cme &&
        cme.send(
          'resetUI',
          {
            hideList: hideUiList,
          },
          () => {
            print('desc', 'done reset  成功:', hideUiList)
          }
        )
    }
  })
  fnList.forEach((item, index) => {
    editorWrapper.appendChild(
      createBtn({
        id: index,
        type: 'btn',
        text: item.text,
        handler: item.click,
      }) as HTMLElement
    )
  })
}

/**
 * 测试流程
 */
main()
