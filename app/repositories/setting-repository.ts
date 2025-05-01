import axios from '~/support/axios'
import { Repository } from '~/support/repositories/repository'
import { ResponseData } from '~/types'

export class SettingRepository extends Repository {
  public async updateProfile(name: string, email: string): Promise<ResponseData> {
    try {
      const response = await axios.patch('/settings/profile', {
        email,
        name
      })
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }

  public async resetPassword(
    curentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
  ): Promise<ResponseData> {
    try {
      const response = await axios.put('/settings/password', {
        current_password: curentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation
      })
      return response.data as ResponseData
    } catch (error) {
      this.throwError(error)
    }
  }
}
