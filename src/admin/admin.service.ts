import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private adminRepository: typeof Admin,
    private readonly jwtService: JwtService,
  ) {}

  async register(createAdminDto: CreateAdminDto) {
    const adminByEmail = await this.getAdminByEmail(createAdminDto.email);
    if (adminByEmail) {
      throw new BadRequestException('Email already registered!');
    }
    const hashed_password = await bcrypt.hash(createAdminDto.password, 7);
    const newAdmin = await this.adminRepository.create({
      id: uuid(),
      ...createAdminDto,
      hashed_password,
    });
    const tokens = await this.getTokens(newAdmin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedAdmin = await this.adminRepository.update(
      {
        hashed_refresh_token,
      },
      {
        where: { id: newAdmin.id },
      },
    );
    const adminData = await this.adminRepository.findOne({
      where: { id: newAdmin.id },
      attributes: ['id', 'email'],
    });
    const response = {
      status: 200,
      data: {
        token: tokens.access_token,
        admin: adminData,
      },
      success: true,
    };
    return response;
  }

  async login(createAdminDto: CreateAdminDto) {
    const { email, password } = createAdminDto;
    const admin = await this.getAdminByEmail(email);
    if (!admin) {
      throw new UnauthorizedException('Email or password is wrong');
    }
    const isMatchPass = await bcrypt.compare(password, admin.hashed_password);
    if (!isMatchPass) {
      throw new UnauthorizedException('Email or password is wrong');
    }
    const tokens = await this.getTokens(admin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedAdmin = await this.adminRepository.update(
      {
        hashed_refresh_token,
      },
      {
        where: { id: admin.id },
      },
    );
    const adminData = await this.adminRepository.findOne({
      where: { id: admin.id },
      attributes: ['id', 'email'],
    });
    const response = {
      status: 200,
      data: {
        token: tokens.access_token,
        admin: adminData,
      },
      success: true,
    };
    return response;
  }

  async create(createAdminDto: CreateAdminDto) {
    const id = uuid();
    return this.adminRepository.create({ id, ...createAdminDto });
  }

  async findAll() {
    return this.adminRepository.findAll({
      attributes: ['id', 'email'],
    });
  }

  async findOne(id: string) {
    const admin = await this.adminRepository.findOne({
      where: { id },
      attributes: ['id', 'email'],
    });
    if (!admin) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }
    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    await this.findOne(id);
    await this.adminRepository.update(updateAdminDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const admin = await this.findOne(id);
    await this.adminRepository.destroy({ where: { id } });
    return admin;
  }

  async getTokens(admin: Admin) {
    const jwtPayload = {
      id: admin.id,
      email: admin.email,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async verifyAccessToken(authHeader: string) {
    try {
      const access_token = authHeader.split(' ')[1];
      const admin = await this.jwtService.verify(access_token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      return admin;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getAdminByEmail(email: string) {
    const admin = await this.adminRepository.findOne({
      where: { email },
    });
    return admin;
  }
}
