import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { LoginStudentDto } from './dto/login-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from "bcrypt";

@Injectable()
export class StudentService {

  private jwtService: JwtService;
  constructor(@InjectRepository(Student) private studentRepo: Repository<Student>) { }

  tokenService() {
    this.jwtService = new JwtService({
      secret: "abc@@@###",
      signOptions: { expiresIn: "60s" }
    })
  }

  async create(createStudentDto: CreateStudentDto) {
    const email = createStudentDto['eamil']
    try {
      const checkEmail = await this.studentRepo.findOne({ where: { email: email } });
      if (checkEmail) {
        throw new NotAcceptableException("Email Id already register")
      }
      const password = createStudentDto["password"]
      const newpassword = await bcrypt.hash(password, 10)
      createStudentDto['password'] = newpassword
      return this.studentRepo.save(createStudentDto)
    } catch (error) {
      console.log(error)
    }
  }

  async findOne(loginStudentDto: LoginStudentDto) {
    let user = await this.studentRepo.findOne({ where: { email: loginStudentDto.email } })
    if (!user) {
      throw new NotFoundException('could not find the user');
    }
    const checkpassword = await bcrypt.compare(loginStudentDto.password, user.password)
    if (!checkpassword) {
      throw new NotFoundException('invalid password');
    }
    const payload={username:user.email,id:user.id}
    this.tokenService()
    const token=this.jwtService.sign(payload)
    user.token=token
    await this.studentRepo.save(user)
    return {
      email:user.email,
      token: token
    };
  }

}
