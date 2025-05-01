import axios from '~/support/axios'
import { Repository } from '~/support/repositories/repository'
import { ResponseData, User } from '~/types'

type LoginResponse = {
  token: string
}

export class AuthRepository extends Repository {
  public async login(email: string, password: string): Promise<ResponseData<LoginResponse>> {
    try {
      const response = await axios.post('/login', {
        email,
        password
      })
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }

  public async profile(): Promise<ResponseData<User>> {
    try {
      const response = await axios.get('/me')
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }

  public async logout(): Promise<ResponseData<User>> {
    try {
      const response = await axios.post('/logout')
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }

  public async register(request: object | FormData): Promise<ResponseData> {
    try {
      const response = await axios.post('/register', request)
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }

  public async sendEmailVerification(): Promise<ResponseData> {
    try {
      const response = await axios.post('/email/verification-notification')
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }
}
