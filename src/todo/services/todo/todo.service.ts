import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from '../../entities';
import { TodoDto, AddTodoDto, EditTodoDto } from '../../dto';
import { TodoMapperService } from '../todo-mapper/todo-mapper.service';

@Injectable()
export class TodoService {
  private logger = new Logger('TodoService');
  public constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    private readonly todoMapper: TodoMapperService,
  ) {}

  public async findAll(): Promise<TodoDto[]> {
    try {
      const todos = await this.todoRepository.find({});
      return todos.map(this.todoMapper.modelToDto);
    } catch (err) {
      this.logger.error(`Failed to get all tasks `, err.stack);
      throw new InternalServerErrorException();
    }
  }

  public async findAllV2(): Promise<TodoDto[] | any> {
    try {
      const todos = await this.todoRepository
        .createQueryBuilder('todo')
        .where('post.id= :id', { postId: 1 }) // created issue to test the error log
        .getOne();
      return todos;
    } catch (err) {
      this.logger.error(`Failed to get all V2 tasks`, err.stack);
      throw new InternalServerErrorException();
    }
  }

  public async findOne(id: number): Promise<TodoDto> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (todo === null || todo === undefined) throw new NotFoundException();
    return this.todoMapper.modelToDto(todo);
  }

  public async add({ title }: AddTodoDto): Promise<TodoDto> {
    let todo = new Todo(title);
    todo = await this.todoRepository.save(todo);
    return this.todoMapper.modelToDto(todo);
  }

  public async edit(
    id: number,
    { title, completed }: EditTodoDto,
  ): Promise<TodoDto> {
    let todo = await this.todoRepository.findOne({ where: { id } });

    if (todo === null || todo === undefined) throw new NotFoundException();

    todo.completed = completed;
    todo.title = title;

    todo = await this.todoRepository.save(todo);

    return this.todoMapper.modelToDto(todo);
  }

  public async remove(id: number): Promise<Todo> {
    let todo = await this.todoRepository.findOne({ where: { id } });

    if (todo === null || todo === undefined) throw new NotFoundException();

    todo = await this.todoRepository.remove(todo);

    return todo;
  }
}
