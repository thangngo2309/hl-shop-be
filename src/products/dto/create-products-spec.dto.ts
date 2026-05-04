import { IsNumber, IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateProductsSpecDto {

    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    value: string;

    @IsString()
    @IsOptional()
    unit?: string;

    @IsNumber()
    @IsNotEmpty()
    position?: number;
}
