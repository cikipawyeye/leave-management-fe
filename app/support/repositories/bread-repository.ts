import axios from '~/support/axios'
import { ResourceRepository } from './resource-repository'
import { CursorPagination, Pagination, ResponseData } from '~/types'

export abstract class BreadRepository extends ResourceRepository {
  resource = ''

  public async paginate(options: any = {}, headers = {}): Promise<Pagination<any>> {
    return (await this.get(options, true, headers)) as Pagination<any>
  }

  public async cursorPaginate(
    options: any = {},
    headers = {}
  ): Promise<CursorPagination<any>> {
    return (await this.get(options, true, headers)) as CursorPagination<any>
  }

  public async get(options: any = {}, paginate = false, headers = {}): Promise<ResponseData> {
    options.paginate = paginate
    const url = this.getResourceUri()

    try {
      const response = await axios.get(url, {
        headers: headers,
        params: options
      })

      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }

  public async show(resourceId: number | string): Promise<ResponseData> {
    try {
      const response = await axios.get(`${this.getResourceUri()}/${resourceId}`)
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }

  public async store(request: object | FormData, headers = {}): Promise<ResponseData> {
    try {
      const response = await axios.post(this.getResourceUri(), request, {
        headers: headers
      })
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }

  public async update(resourceId: number | string, request: object, headers = {}) {
    try {
      const response = await axios.put(`${this.getResourceUri()}/${resourceId}`, request, {
        headers: headers
      })
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }

  public async destroy(resourceId: number) {
    try {
      const response = await axios.delete(`${this.getResourceUri()}/${resourceId}`)
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }
}
