import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PageInputDto } from '../dto/page-input.dto';
import { PageMetaDto } from '../dto/page-meta.dto';
import { PageDto } from '../dto/page.dto';
import { ImageType } from '../enum/imagetype.enum';
import { Image } from '../images/entities/image.entity';
import { ProductSpecs } from './entities/products-spec.entity';
import { CreateProductsSpecDto } from './dto/create-products-spec.dto';
import { UpdateProductsSpecDto } from './dto/update-products-spec.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
    @InjectRepository(ProductSpecs)
    private productSpecsRepository: Repository<ProductSpecs>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(product);
  }

  async findAll(pageInputDto: PageInputDto): Promise<PageDto<Product>> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    const minPrice = pageInputDto.minPrice;
    const maxPrice = pageInputDto.maxPrice;
    let error = "";

    const validations = [
      !minPrice && 'minPrice không được undefined',
      !maxPrice && 'maxPrice không được undefined',
      maxPrice && maxPrice < 0 && 'maxPrice phải lớn hơn 0',
      maxPrice && minPrice && minPrice > maxPrice && 'minPrice không được lớn hơn maxPrice',
    ].filter(Boolean) as string[];

    validations.forEach((message) => {
      error += `${message}. `;
    });

    if (error) {
      throw new BadRequestException(error);
    }

    queryBuilder
      .orderBy('product.price', pageInputDto.orderBy)
      .where('product.name LIKE :searchName', { searchName: `%${pageInputDto.searchName || ''}%` })
      .skip(pageInputDto.skip)
      .take(pageInputDto.limit);

    const conditions: { condition: string; params: object }[] = [
      !!pageInputDto.isActive && {
        condition: 'product.isActive = :isActive',
        params: { isActive: pageInputDto.isActive },
      },
      !!pageInputDto.stock && {
        condition: 'product.stock >= :stock',
        params: { stock: pageInputDto.stock },
      },
      !!minPrice && !!maxPrice && {
        condition: 'product.price BETWEEN :minPrice AND :maxPrice',
        params: { minPrice, maxPrice },
      },
      !!minPrice && !maxPrice && {
        condition: 'product.price >= :minPrice',
        params: { minPrice },
      },
      !!maxPrice && !minPrice && {
        condition: 'product.price <= :maxPrice',
        params: { maxPrice },
      },
    ].filter(Boolean) as { condition: string; params: object }[];

    conditions.forEach(({ condition, params }) => {
      queryBuilder.andWhere(condition, params);
    });

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

  async findDetail(id: number) {
    const [product, images] = await Promise.all([
      this.productsRepository.findOne({
        where: { product_id: id },
        relations: ['specs'],
      }),
      this.imagesRepository.find({
        where: { type: ImageType.PRODUCT, entity_id: id },
        order: { position: 'ASC' },
      }),
    ]);

    return {
      product,
      images,
    };
  }

    async createSpec(createProductsSpecDto: CreateProductsSpecDto) {
      const productSpecification = this.productSpecsRepository.create(createProductsSpecDto);
      return await this.productSpecsRepository.save(productSpecification);
    }
  
    async findOneSpec(id: number) {
      return await this.productSpecsRepository.findOneBy({ id: id });
    }
  
    async updateSpec(id: number, updateProductsSpecDto: UpdateProductsSpecDto) {
      await this.productSpecsRepository.update({ id: id }, updateProductsSpecDto);
      return await this.findOneSpec(id);
    }
  
    async removeSpec(id: number) {
      return await this.productSpecsRepository.delete({ id: id });
    }
  
    async getProductsSpecsByProductId(productId: number) {
      return await this.productSpecsRepository.find({
        where: { productId: productId },
        relations: ['product'],
      });
    }
}