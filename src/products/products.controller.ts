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
import { CreateProductsSpecDto } from './dto/create-products-spec.dto';
import { UpdateProductsSpecDto } from './dto/update-products-spec.dto';
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

  @Get(':id/detail')
  @Public()
  findDetail(@Param('id') id: string) {
    return this.productsService.findDetail(+id);
  }

  @Post('/spec')
  @Roles([UserRole.ADMIN])
  createSpec(@Body() createProductsSpecDto: CreateProductsSpecDto) {
    return this.productsService.createSpec(createProductsSpecDto);
  }

  @Get('/spec/:id')
  @Public()
  getProductsSpecsByProductId(@Param('id') id: string) {
    return this.productsService.getProductsSpecsByProductId(+id);
  }

  @Patch('/spec/:id')
  @Roles([UserRole.ADMIN])
  updateSpec(@Param('id') id: string, @Body() updateProductsSpecDto: UpdateProductsSpecDto) {
    return this.productsService.updateSpec(+id, updateProductsSpecDto);
  }

  @Delete('/spec/:id')
  @Roles([UserRole.ADMIN])
  removeSpec(@Param('id') id: string) {
    return this.productsService.removeSpec(+id);
  }
}
