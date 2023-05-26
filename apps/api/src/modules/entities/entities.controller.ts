import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import {
  CreateEntityRequest,
  ManyEntitiesResponse,
  OneEntityResponse,
  UpdateEntityRequest,
} from '../../types/entities';
import { EntitiesService } from './entities.service';
import { HttpResponse } from '../models/HttpResponse';

@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  /** @tag entities */
  @TypedRoute.Post()
  create(
    @TypedBody() createEntityRequest: CreateEntityRequest,
  ): OneEntityResponse {
    return new HttpResponse(this.entitiesService.create(createEntityRequest));
  }

  /** @tag entities */
  @TypedRoute.Get()
  findAll(): ManyEntitiesResponse {
    return new HttpResponse(this.entitiesService.findAll());
  }

  /** @tag entities */
  @TypedRoute.Get(':id')
  findOne(@TypedParam('id') id: string): OneEntityResponse {
    return new HttpResponse(this.entitiesService.findOne(id));
  }

  /** @tag entities */
  @TypedRoute.Patch(':id')
  update(
    @TypedParam('id') id: string,
    @TypedBody() updateEntityRequest: UpdateEntityRequest,
  ): OneEntityResponse {
    return new HttpResponse(
      this.entitiesService.update(id, updateEntityRequest),
    );
  }

  /** @tag entities */
  @TypedRoute.Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@TypedParam('id') id: string) {
    return this.entitiesService.remove(id);
  }
}
