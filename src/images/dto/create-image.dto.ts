import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ImageType } from "../../enum/imagetype.enum";

export class CreateImageDto {

    @IsString()
    @IsNotEmpty()
    storage_path: string;

    @IsString()
    @IsNotEmpty()
    file_name: string;

    @IsEnum(ImageType)
    @IsNotEmpty()
    type: ImageType;

    @IsNumber()
    @IsNotEmpty()
    entity_id: number;

    @IsNumber()
    @IsNotEmpty()
    position: number;
}
