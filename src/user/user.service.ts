import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async create(createUserDto: CreateUserDto) {
    const id = uuid();
    return this.userRepository.create({ id, ...createUserDto });
  }

  async findAll() {
    return this.userRepository.findAll({
      attributes: ['id', 'fullname'],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      attributes: ['id', 'fullname'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    await this.userRepository.update(updateUserDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    // await this.userRepository.destroy({ where: { id } });
    return user;
  }
}
