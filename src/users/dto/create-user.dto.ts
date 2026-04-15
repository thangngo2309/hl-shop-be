/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty, IsOptional, Length, IsEnum, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(50)
    @MinLength(3)
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(255)
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    @Length(100)
    name?: string;

    @IsEnum(['user', 'admin'])
    @IsOptional()
    role?: 'user' | 'admin';
}
