import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PageInputDto } from '../dto/page-input.dto';
import { PageMetaDto } from '../dto/page-meta.dto';
import { PageDto } from '../dto/page.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(product);
  }

  async findAll(pageInputDto: PageInputDto,): Promise<PageDto<Product>> {
      const queryBuilder = this.productsRepository.createQueryBuilder('product');

      queryBuilder
      .orderBy('product.product_id', pageInputDto.orderBy)
      .where('product.name LIKE :searchName', { searchName: `%${pageInputDto.searchName || ''}%` })
      .skip(pageInputDto.skip)
      .take(pageInputDto.limit);

      if (pageInputDto.isActive !== undefined) {
        queryBuilder.andWhere('product.isActive = :isActive', { isActive: pageInputDto.isActive });
      }

      if (pageInputDto.stock !== undefined) {
        queryBuilder.andWhere('product.stock >= :stock', { stock: pageInputDto.stock || 0 });
      }

      const itemCount = await queryBuilder.getCount();
      const itemTotalCount = await this.productsRepository.count();
      const { entities } = await queryBuilder.getRawAndEntities();
      const pageMetaDto = new PageMetaDto(pageInputDto, itemCount, itemTotalCount);

      return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.productsRepository.findOneBy({ product_id: id });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.productsRepository.update({ product_id: id }, updateProductDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.productsRepository.delete({ product_id: id });
  }
}
