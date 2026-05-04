import { IsString, IsNotEmpty, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { UserRole } from '../../enum/users.enum';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(3)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    name: string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;
}
