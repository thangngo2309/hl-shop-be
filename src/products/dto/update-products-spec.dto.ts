import { PartialType } from '@nestjs/mapped-types';
import { CreateProductsSpecDto } from '../../products/dto/create-products-spec.dto';

export class UpdateProductsSpecDto extends PartialType(CreateProductsSpecDto) {}
