import BaseException from './base-exception'

export default class ServerError extends BaseException {
  constructor(message: string) {
    super(message)
  }
}
