import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AbilityFactory, Action } from '../ability/ability.factory';
import { User } from './entities/user.entity';
import { ForbiddenError } from '@casl/ability';
import {
  CheckAbilities,
  ReadUserAbility,
} from '../ability/abilities.decorator';
import { AbilitiesGuard } from '../ability/abilities.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private abilityFactory: AbilityFactory,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const user = { id: 1, isAdmin: false, orgId: 1 }; //req.user (mocked Data)
    const ability = this.abilityFactory.defineAbilitiesFor(user);

    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.CREATE, User);
      return this.userService.create(createUserDto);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }
  }

  @Get()
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.UPDATE, subject: User })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // Pull user data from DB before executing the CASL check
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.DELETE, subject: User })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
