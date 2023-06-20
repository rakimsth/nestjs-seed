import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { AbilityModule } from './ability/ability.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      autoLoadEntities: true,
      synchronize: true,
      database: path.resolve(__dirname, '..', 'db.sqlite'),
    }),
    TodoModule,
    UserModule,
    AbilityModule,
  ],
})
export class AppModule {}
