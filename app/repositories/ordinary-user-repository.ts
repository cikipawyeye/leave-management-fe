import axios from '~/support/axios'
import { BreadRepository } from '~/support/repositories/bread-repository'
import { ResponseData } from '~/types'

export class OrdinaryUserRepository extends BreadRepository {
  resource = '/ordinary-users'

  public async verifyAccount(resourceId: number) {
    try {
      const response = await axios.post(`${this.getResourceUri()}/${resourceId}/verify`)
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }
}
