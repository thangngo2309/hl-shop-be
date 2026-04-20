import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(255)
    name: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    @MaxLength(255)
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    stock: number;

    @IsString()
    @IsOptional()
    image: string;

    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;
}