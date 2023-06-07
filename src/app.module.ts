import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { User } from './user/models/user.model';
import { Image } from './image/models/image.model';
import { ImageModule } from './image/image.module';
import { JobModule } from './job/job.module';
import { Job } from './job/models/job.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      models: [User, Image, Job],
      autoLoadModels: true,
      logging: false,
    }),
    UserModule,
    ImageModule,
    JobModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
