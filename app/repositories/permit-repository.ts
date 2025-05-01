import axios from '~/support/axios'
import { BreadRepository } from '~/support/repositories/bread-repository'
import { ResponseData } from '~/types'

export class PermitRepository extends BreadRepository {
  resource = '/permits'

  public async cancel(resourceId: number) {
    try {
      const response = await axios.post(`/permits/${resourceId}/cancel`)
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }
}
