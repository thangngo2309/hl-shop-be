import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(255)
  password?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  username: string;

  @IsString()
  @IsOptional()
  @MinLength(100)
  name?: string;

  @IsEnum(['user', 'admin'])
  @IsOptional()
  role?: 'user' | 'admin';
}
