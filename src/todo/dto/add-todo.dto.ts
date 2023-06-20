import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddTodoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title of the Todo',
    example: 'Make Bed',
  })
  public readonly title: string;

  public constructor(opts?: Partial<AddTodoDto>) {
    Object.assign(this, opts);
  }
}
