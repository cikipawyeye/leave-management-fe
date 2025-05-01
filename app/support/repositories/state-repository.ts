import axios from 'axios'
import { BreadRepository } from './bread-repository'
import { ResponseData } from '~/types'

type Constructor<T = {}> = new (...args: any[]) => T

export function StateMixin<TBase extends Constructor<BreadRepository>>(Base: TBase) {
  return class StateRepository extends Base {
    public async setState(resourceId: number, state: string): Promise<ResponseData> {
      try {
        const response = await axios.put(`${this.getResourceUri()}/${resourceId}/state`, {
          state
        })

        return response.data as ResponseData
      } catch (error) {
        this.throwError(error)
      }
    }
  }
}
