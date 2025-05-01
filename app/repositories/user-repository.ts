import axios from '~/support/axios'
import { BreadRepository } from '~/support/repositories/bread-repository'
import { ResponseData } from '~/types'

export class UserRepository extends BreadRepository {
  resource = '/users'

  public async resetPassword(resourceId: number | string, request: object, headers = {}) {
    try {
      const response = await axios.patch(`${this.getResourceUri()}/${resourceId}/reset-password`, request, {
        headers: headers
      })
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }
}
