import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserRole } from '../enum/users.enum';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';
import { PageInputDto } from '../dto/page-input.dto';
import { PageDto } from '../dto/page.dto';
import { Product } from './entities/product.entity';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @Roles([UserRole.ADMIN])
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Public()
  findAll(@Query() PageInputDto: PageInputDto): Promise<PageDto<Product>> {
    return this.productsService.findAll(PageInputDto);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @Roles([UserRole.ADMIN])
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles([UserRole.ADMIN])
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
