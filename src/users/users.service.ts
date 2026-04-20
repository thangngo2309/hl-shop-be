import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../enum/users.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const role = createUserDto.role || UserRole.USER;
    const password = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password,
      role: role,
    });
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ user_id: id });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const partialUser: Partial<User> = {
      ...updateUserDto,
      role: updateUserDto.role ? (updateUserDto.role) : undefined,
    };

    if (updateUserDto.password) {
      partialUser.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usersRepository.update({ user_id: id }, partialUser);
    return this.usersRepository.findOneBy({ user_id: id });
  }

  remove(id: number): Promise<void> {
    return this.usersRepository.delete({ user_id: id }).then(() => undefined);
  }
}