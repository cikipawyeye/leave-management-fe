import BaseException from './base-exception'

export default class ValidationError extends BaseException {
  constructor(message: string) {
    super(message)
  }
}
