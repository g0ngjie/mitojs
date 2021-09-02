import { EventTypes, SDK_NAME, SDK_VERSION } from '@mitojs/shared'
import { BaseClientType, BaseOptionsFieldsIntegrationType, BasePluginType } from '@mitojs/types'
import Subscrib from './subscribe'

export default class BaseClient<O extends BaseOptionsFieldsIntegrationType, E extends EventTypes> implements BaseClientType {
  SDK_NAME = SDK_NAME
  SDK_VERSION = SDK_VERSION
  options: BaseOptionsFieldsIntegrationType
  constructor(options: O) {
    this.options = options
  }
  use(plugins: BasePluginType<E>[]) {
    const subscrib = new Subscrib<E>()
    plugins.forEach((item) => {
      const wrapperTranform = (...args: any[]) => {
        const res = item.transform.apply(this, args)
        item.consumer.call(this, res)
      }
      subscrib.watch(item.name, wrapperTranform)
    })
  }
  getOptions() {
    return this.options
  }
}