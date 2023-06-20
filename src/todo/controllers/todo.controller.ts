import { TodoService } from './../services/todo/todo.service';
import { TodoDto, AddTodoDto, EditTodoDto } from './../dto';

import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Body,
  Delete,
  Version,
  Logger,
} from '@nestjs/common';

@Controller('todos')
export class TodoController {
  private logger = new Logger('TodoController');
  public constructor(private readonly todoService: TodoService) {}

  @Version('1')
  @Get()
  public findAll(): Promise<TodoDto[]> {
    this.logger.verbose('Version 1');
    return this.todoService.findAll();
  }

  @Version('2')
  @Get()
  public findAllV2(): Promise<TodoDto[]> {
    this.logger.verbose('Version 2');
    return this.todoService.findAllV2();
  }

  @Version('1')
  @Get(':id')
  public findOne(@Param('id') id: number): Promise<TodoDto> {
    return this.todoService.findOne(id);
  }

  @Version('1')
  @Put(':id')
  public edit(
    @Param('id') id: number,
    @Body() todo: EditTodoDto,
  ): Promise<TodoDto> {
    this.logger.verbose(
      `Updating todo id number ${id}. Data: ${JSON.stringify(todo)}`,
    );
    return this.todoService.edit(id, todo);
  }

  @Version('1')
  @Post()
  public add(@Body() todo: AddTodoDto): Promise<TodoDto> {
    this.logger.verbose(`Creating new todo... Data: ${JSON.stringify(todo)}`);
    return this.todoService.add(todo);
  }

  @Version('1')
  @Delete(':id')
  public remove(@Param('id') id: number): Promise<TodoDto> {
    this.logger.verbose(`Deleting todo task... Data: ${JSON.stringify(id)}`);
    return this.todoService.remove(id);
  }
}
