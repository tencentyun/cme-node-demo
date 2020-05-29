import { Page } from './Page'
import { el, print, myRequest } from '../util/util'

export let Editor = new Page({
  tpl: require('../views/editor.html'),
  mounted(
    _con,
    route,
    param: {
      Signature: string
      pid: string
    }
  ) {
    if (!param.Signature) {
      route.goto('projects')
      return
    }
    let global: any = window
    let init: CME.init = global.CME.init
    let cme: CME.CmeInstance | null = null
    let container = el('container')!
    let msgBox = el('message')!

    /**
     * 轮询导出任务
     * @param TaskId
     */
    function watchTask(TaskId: string) {
      myRequest('Project/describeTaskDetail', {
        TaskId: TaskId,
      }).then((data) => {
        msgBox.textContent = `导出中:${data.Data.Progress}% ,状态${data.Data.Status}`
        if (Number(data.Data.Progress) < 100 || data.Data.Status === 'PROCESSING') {
          setTimeout(() => {
            watchTask(TaskId)
          }, 2 * 1000)
        } else {
          if (data.Data.URL && data.Data.URL != '') {
            msgBox.innerHTML = `导出成功，请点击<a href='${data.Data.URL}' >这里</a>查看结果`
          }
        }
        console.log(data)
      })
    }

    /**
     * 初始化入口函数，传入CME实例对象
     * @param cmd
     */
    function initedCme(cmd: CME.CmeInstance) {
      let exporting = false
      cmd.on('Error', (arg) => {
        console.log('Error:', arg)
      })
      cmd.on('Editor:MoreResourceBtn:Click', () => {
        msgBox.textContent = '点击更多资源'
      })
      cmd.on('Editor:UploadBtn:Click', async () => {
        msgBox.textContent = '点击上传'
        let res = await myRequest('upload/ApplyUploadSign', {})
        console.log('sign', res)

        let sign = res.Data.sign
        msgBox.textContent = `已获取上传签名，展示上传面板。\n${res.Data.sign}`
        cmd.send('showUpload', { sign }, (data) => {
          console.log('upload done', data)
        })
      })
      cmd.on('Editor:MoreResourceBtn:Click', () => {
        console.log('第二个函数')
      })

      cmd.on('Header:BackBtn:Click', () => {
        msgBox.textContent = '点击返回'
        route.goto('projects')
      })
      cmd.on('Editor:ExportBtn:Click', () => {
        if (exporting) {
          msgBox.textContent = '正在导出...请稍后再试'
          return
        }
        exporting = true
        msgBox.textContent = '正在导出...'

        myRequest('Project/exportVideoEditProject', {
          ProjectId: param.pid,
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

    /**
     * 初始化实例
     */
    print('desc', '初始化 clicked')
    cme = init(container, {
      sign: param.Signature,
    })
    initedCme(cme)
    ;(window as any).myCme = cme
    msgBox.textContent = '正在初始化...'

    cme.on('Editor:Ready', () => {
      msgBox.textContent = '初始化完成，等待交互'
      print('desc', 'iframe Ready')
    })

    console.log('this is Editor param11', param)
  },
})
