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

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth('access_token')
@ApiTags('todos')
@Controller('todos')
export class TodoController {
  private logger = new Logger('TodoController');
  public constructor(private readonly todoService: TodoService) {}

  @Version('1')
  @Get()
  @ApiOperation({ summary: 'Get All Todos' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [TodoDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public findAll(): Promise<TodoDto[]> {
    this.logger.verbose('V1 >> Find All');
    return this.todoService.findAll();
  }

  @Version('2')
  @Get()
  @ApiOperation({ summary: 'V2: Get All Todos' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [TodoDto],
  })
  public findAllV2(): Promise<TodoDto[]> {
    this.logger.verbose('V2 >> Find All');
    return this.todoService.findAllV2();
  }

  @Version('1')
  @Get(':id')
  @ApiOperation({ summary: 'Get One Todo' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: TodoDto,
  })
  public findOne(@Param('id') id: number): Promise<TodoDto> {
    return this.todoService.findOne(id);
  }

  @Version('1')
  @ApiOperation({ summary: 'Update Todo' })
  @ApiResponse({
    status: 201,
    description: 'The todo has been successfully updated.',
    type: TodoDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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
  @ApiOperation({ summary: 'Create Todo' })
  @ApiResponse({
    status: 201,
    description: 'The todo has been successfully created.',
    type: TodoDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  public add(@Body() todo: AddTodoDto): Promise<TodoDto> {
    this.logger.verbose(`Creating new todo... Data: ${JSON.stringify(todo)}`);
    return this.todoService.add(todo);
  }

  @Version('1')
  @ApiOperation({ summary: 'Delete todo' })
  @ApiResponse({
    status: 201,
    description: 'The todo has been successfully deleted.',
    type: TodoDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  public remove(@Param('id') id: number): Promise<TodoDto> {
    this.logger.verbose(`Deleting todo task... Data: ${JSON.stringify(id)}`);
    return this.todoService.remove(id);
  }
}
