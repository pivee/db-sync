import { HttpResponse } from './core';

export type Entity = {
  /**
   * @format uuid
   */
  id: string;
  /**
   * @minLength 1
   * @maxLength 100
   */
  name: string;
};

export interface OneEntityResponse extends HttpResponse<Entity | undefined> {}

export interface ManyEntitiesResponse
  extends HttpResponse<Entity[] | undefined> {}

export interface CreateEntityRequest extends Omit<Entity, 'id'> {}

export interface UpdateEntityRequest extends Partial<CreateEntityRequest> {}
