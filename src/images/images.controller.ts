import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query, ParseIntPipe, ParseEnumPipe } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from '../decorators/public.decorator';
import { ImageType } from '../enum/imagetype.enum';
import 'multer';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }

  @Get(':id')
  @Public()
  findOne(
    @Param('id') entity_id: string,
    @Query('type', new ParseEnumPipe(ImageType)) type: ImageType,
  ) {
    return this.imagesService.findByTypeEntity(+entity_id, type);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Phải gửi file ảnh!'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('type', new ParseEnumPipe(ImageType)) type: ImageType,
    @Query('entity_id', ParseIntPipe) entityId: number,
  ) {
    return this.imagesService.uploadImages(files, type, entityId);
  }
}
