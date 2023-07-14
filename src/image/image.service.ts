import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from './models/image.model';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: 'upload-image-392818',
  keyFilename: 'config/keyfile.json',
});

@Injectable()
export class ImageService {
  constructor(@InjectModel(Image) private imageRepository: typeof Image) {}

  async create(images: Express.Multer.File[]) {
    if (!images) {
      throw new BadRequestException('There is no image');
    }
    const fileNames = await this.createFile(images);
    const response = [];
    for (let i of fileNames) {
      const newImage = await this.imageRepository.create({
        id: uuid(),
        file_name: i,
      });
      response.push(newImage);
    }
    return response;
  }

  async findAll() {
    return this.imageRepository.findAll({
      attributes: ['id', 'file_name', 'createdAt'],
    });
  }

  async findOne(id: string) {
    const image = await this.imageRepository.findOne({
      where: { id },
      attributes: ['id', 'file_name', 'createdAt'],
      include: { all: true },
    });
    if (!image) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
    return image;
  }

  async remove(id: string) {
    const image = await this.findOne(id);
    await this.removeFile(image.file_name);

    await this.imageRepository.destroy({ where: { id } });
    return image;
  }

  async createFile(images: Express.Multer.File[]) {
    try {
      const fileNames: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const bucketName = 'upload-image-nest';
        const bucket = storage.bucket(bucketName);

        const fileName = (await this.generateUniqueFileName()) + '.jpg';
        const file = bucket.file(fileName);

        await file.save(images[i].buffer, { resumable: false });
        fileNames.push(fileName);
      }
      return fileNames;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error with uploading images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getImage(imageName: string, res: Response) {
    const bucketName = 'upload-image-nest';
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(imageName);

    const exists = file.exists();
    if (!exists[0]) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }

    const stream = file.createReadStream();
    stream.pipe(res);
  }

  async removeFile(fileName: string) {
    try {
      const bucketName = 'upload-image-nest';
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(fileName);

      const exists = file.exists();
      if (exists[0]) {
        await file.delete();
        return fileName;
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error with deleting images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateFileName() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefix =
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length));
    const suffix = Math.floor(Math.random() * 90000) + 10000;
    return prefix + suffix;
  }

  async generateUniqueFileName() {
    const allUniqueFileNames = await this.imageRepository.findAll({
      attributes: ['file_name'],
    });
    let filename: any;
    while (true) {
      filename = await this.generateFileName();
      if (!allUniqueFileNames.includes(filename)) {
        break;
      }
    }
    return filename;
  }
}
