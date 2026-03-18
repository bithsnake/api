import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';

export abstract class BaseService<T, S, R> {
  protected readonly __baseServiceBrand!: never;
  abstract create(body: S): Promise<T>;
  abstract getById(id: number): Promise<T>;
  abstract getAll(): Promise<T[]>;
  abstract update(id: number, body: R): Promise<T>;
  abstract delete(id: number): Promise<void>;
}

/**
 * A generic base controller that provides standard CRUD endpoints for any resource.
 * @template T The type of the resource returned by the endpoints (e.g., UserResponse).
 * @template S The type of the DTO used for creating a new resource (e.g., CreateUserDto).
 * @template R The type of the DTO used for updating an existing resource (e.g., UpdateUserDto).
 * @template V The type of the service that extends BaseService and provides the actual data operations.
  The controller uses the provided service to implement the CRUD operations, allowing for code reuse and consistency across different resources.
 */
export abstract class BaseController<T, S, R, V extends BaseService<T, S, R>> {
  constructor(private readonly service: V) {}
  @Get()
  async getAll(): Promise<T[]> {
    return await this.service.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<T | null> {
    return await this.service.getById(id);
  }

  @Post()
  async create(@Body() body: S): Promise<T> {
    return await this.service.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: R): Promise<T | null> {
    return await this.service.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.service.delete(id);
  }
}
