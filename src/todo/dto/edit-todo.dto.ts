import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditTodoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title of the Todo',
    example: 'Make Bed',
  })
  public readonly title: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Status of the Todo',
    example: 'True/False',
  })
  public readonly completed: boolean;

  public constructor(opts?: Partial<EditTodoDto>) {
    Object.assign(this, opts);
  }
}
