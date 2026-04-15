import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Length(50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Length(255)
  password: string;
}