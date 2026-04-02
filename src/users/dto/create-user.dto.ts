/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty, IsOptional, MinLength, IsEnum } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(50)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(255)
    password: string;

    @IsString()
    @IsOptional()
    @MinLength(100)
    name?: string;

    @IsEnum(['user', 'admin'])
    @IsOptional()
    role?: 'user' | 'admin';
}
