import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo:Repository<User>){}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepo.save(createUserDto);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: string) {
    return await this.userRepo.findOne({where:{id:id}});
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepo.update(id,updateUserDto)
    return this.userRepo.findOne({where:{id:id}});
  }

  async remove(id: string) {
    await this.userRepo.delete(id)
    return this.userRepo.findOne({where:{id:id}});
  }
}
