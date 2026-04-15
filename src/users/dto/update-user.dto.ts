import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(255)
  @MinLength(6)
  password?: string;

  @IsString()
  @IsNotEmpty()
  @Length(50)
  @MinLength(3)
  username: string;

  @IsString()
  @IsOptional()
  @Length(100)
  name?: string;

  @IsEnum(['user', 'admin'])
  @IsOptional()
  role?: 'user' | 'admin';
}
