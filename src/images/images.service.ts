import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImageType } from '../enum/imagetype.enum';
import { createClient } from '@supabase/supabase-js';
import { SucceededType } from '../model/succeeded-type';
import { FailedType } from '../model/failed-type';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImagesService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) { }

async uploadImages(files: Express.Multer.File[], type: ImageType, entityId: number) {
  const results = await Promise.allSettled(
    files.map((file) => {
      const ext = file.originalname.split('.').pop();
      const path = `${type}/${entityId}/${Date.now()}.${uuidv4()}.${ext}`;
      return this.uploadToSupabase(file, path);
    }),
    );

    const succeeded: SucceededType[] = [];
    const failed: FailedType[] = [];
    const imagesToSave: CreateImageDto[] = [];

    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        imagesToSave.push({
          file_name: files[i].originalname,
          type,
          entity_id: entityId,
          storage_path: result.value.path,
          position: i,
        });
        succeeded.push({
          originalname: files[i].originalname,
          mimetype: files[i].mimetype,
          size: files[i].size,
          type,
          entity_id: entityId,
          storage_path: result.value.path,
        });
      } else {
        failed.push({
          filename: files[i].originalname,
          reason: result.reason instanceof Error ? result.reason.message : 'Unknown error',
        });
      }
    });

    if (imagesToSave.length > 0) {
      await this.imagesRepository.save(imagesToSave);
    }

    return { succeeded, failed };
  }
  async create(createImageDto: CreateImageDto) {
    const image = this.imagesRepository.create(createImageDto);
    return await this.imagesRepository.save(image);
  }

  async findOne(id: number) {
    return await this.imagesRepository.findOneBy({ id: id });
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    await this.imagesRepository.update({ id: id }, updateImageDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.imagesRepository.delete({ id: id });
  }

  async findByTypeEntity(entity_id: number, type: ImageType) {
    return await this.imagesRepository.findBy({ entity_id: entity_id, type: type });
  }

  async uploadToSupabase(file: Express.Multer.File, path: string) {
    const { data, error } = await this.supabase.storage
      .from('images')
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });
    if (error) {
      throw new Error(`Error uploading file to Supabase: ${error.message}`);
    }
    return data;
  }
}