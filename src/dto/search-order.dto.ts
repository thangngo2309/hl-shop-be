import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { OrderBy } from "../enum/ordersby.enum";
import { Type, Transform } from "class-transformer";

export class SearchOrderDto {
    @IsEnum(OrderBy)
    @IsOptional()
    readonly orderBy?: OrderBy = OrderBy.ASC;

    @IsString()
    @IsOptional()
    readonly searchName?: string;

    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    @IsOptional()
    readonly isActive?: boolean;

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    readonly stock?: number;
}