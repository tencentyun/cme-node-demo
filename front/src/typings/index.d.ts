/**
 * 第一版接口说明
 * 版本规则,基础版本位为第一位，第二位版本号为向前兼容版本，每次向前兼容版本时自增
 * @version 1.0
 */
declare namespace CME {
  const version = '1.0'
  type initOptions = {
    sign: string
    path?: string
    onLoaded?: any
    onError?: any
  }
  /**
   * 模块
   * @property Editor 编辑页 相关内容
   */
  interface module {
    Editor: {
      target: 'Editor:MoreResourceBtn' | 'Editor:Resource'
    }
  }
  interface baseRes<T = any> {
    id: string
    ret: number
    msg: string
    type: 'event'
    data: T
  }
  interface CMDS<T extends keyof module> {
    reload: {
      param: {
        target: module[T]
      }
      result: baseRes<{}>
    }
  }

  interface ResponseType {
    event: {
      'Editor:ready': {}
    }
    callback: {
      'Editor:reload': {
        val: any
      }
    }
  }
  interface Res<T> {
    name: keyof T
    val?: T[Res<T>['name']]
  }
  interface BaseResponse<T extends keyof ResponseType> {
    id: string
    time: number
    type: T
    data: Res<ResponseType[T]>
  }

  /**
   * CME实例
   * @property {{string}} version  接口版本
   * @method destroy 销毁当前实例
   * @method reload 刷新当前实例
   * @method
   *
   */
  interface CmeInstance {
    send(cmd: string, callback: (err: any, data: any) => void): void
    send(cmd: string, arg: any, callback: (err: any, data: any) => void): void
    send<R extends keyof module, T extends keyof CMDS<R>>(
      cmd: T,
      arg: CMDS<R>[T]['param'],
      callback: (res: CMDS<R>[T]['result']) => void
    ): void

    destroy(): void

    on<T extends keyof Event>(eventName: T, callback: (event: Event[T]) => void): void
    on(eventName: string, callback: (event: any) => void): void
    off(eventName: string, callback: any): void
  }

  interface init {
    (el: HTMLElement, Options: initOptions): CmeInstance
  }
}
