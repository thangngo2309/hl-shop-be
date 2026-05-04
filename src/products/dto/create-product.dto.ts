import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(255)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    description: string;

    @IsString()
    @IsOptional()
    info: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    stock: number;

    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;
}