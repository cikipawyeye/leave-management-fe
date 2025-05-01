import { Repository } from './repository'

export abstract class ResourceRepository extends Repository {
  abstract resource: string

  public getResourceUri() {
    return this.resource
  }
}
