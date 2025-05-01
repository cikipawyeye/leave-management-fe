import { AxiosError } from 'axios'
import ValidationError from '../exceptions/validation-error'
import ServerError from '../exceptions/server-error'

export abstract class Repository {
  public throwError(error: unknown): never {
    if (error instanceof AxiosError) {
      if (error.response?.status && error.response?.status >= 500) {
        throw new ServerError(error.response?.data.message ?? 'Server error')
      } else {
        throw new ValidationError(error.response?.data.message)
      }
    } else {
      throw error
    }
  }
}
