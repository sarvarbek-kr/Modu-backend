import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min, IsObject, ValidateNested } from 'class-validator';
import {
	FurnitureLocation,
	FurnitureStatus,
	FurnitureType,
	FurnitureCondition,
	FurnitureColor,
	FurnitureMaterial,
	FurnitureBrand,
} from '../../enums/furniture.enum';
import { ObjectId } from 'mongoose';
import { Direction } from '../../enums/common.enum';
import { availableOptions, availableFurnitureSorts } from '../../config';
import { Type } from 'class-transformer';

@InputType()
class FurnitureDimensionsInput {
	@Min(1)
	@IsInt()
	@Field(() => Int)
	width: number;

	@Min(1)
	@IsInt()
	@Field(() => Int)
	height: number;

	@Min(1)
	@IsInt()
	@Field(() => Int)
	depth: number;
}

@InputType()
export class FurnitureInput {
	@IsNotEmpty()
	@Field(() => FurnitureType)
	furnitureType: FurnitureType;

	@IsNotEmpty()
	@Field(() => FurnitureLocation)
	furnitureLocation: FurnitureLocation;

	@IsNotEmpty()
	@Field(() => FurnitureCondition)
	furnitureCondition: FurnitureCondition;

	@IsNotEmpty()
	@IsObject()
	@Type(() => FurnitureDimensionsInput)
	@Field(() => FurnitureDimensionsInput)
	furnitureDimensions: FurnitureDimensionsInput;

	@IsOptional()
	@Field(() => FurnitureColor)
	furnitureColor: FurnitureColor;

	@IsOptional()
	@Field(() => FurnitureMaterial)
	furnitureMaterial: FurnitureMaterial;

	@IsOptional()
	@Field(() => FurnitureBrand)
	furnitureBrand: FurnitureBrand;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	furnitureTitle: string;

	@IsNotEmpty()
	@Field(() => Number)
	furniturePrice: number;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	furnitureImages: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	furnitureDesc?: string;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	furnitureBarter?: boolean;

	memberId?: ObjectId;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}

@InputType()
export class PricesRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class PeriodsRange {
	@Field(() => Date)
	start: Date;

	@Field(() => Date)
	end: Date;
}

@InputType()
class PISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => [FurnitureLocation], { nullable: true })
	locationList?: FurnitureLocation[];

	@IsOptional()
	@Field(() => [FurnitureType], { nullable: true })
	typeList?: FurnitureType[];

	@IsOptional()
	@Field(() => [FurnitureCondition], { nullable: true })
	conditionList?: FurnitureCondition[];

	@IsOptional()
	@Field(() => [FurnitureDimensionsInput], { nullable: true })
	dimensionsList?: FurnitureDimensionsInput[];

	@IsOptional()
	@Field(() => [FurnitureColor], { nullable: true })
	colorList?: FurnitureColor[];

	@IsOptional()
	@Field(() => [FurnitureMaterial], { nullable: true })
	materialList?: FurnitureMaterial[];

	@IsOptional()
	@Field(() => [FurnitureBrand], { nullable: true })
	brandList?: FurnitureBrand[];

	@IsOptional()
	@IsIn(availableOptions, { each: true })
	@Field(() => [String], { nullable: true })
	options?: string[];

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	pricesRange?: PricesRange;

	@IsOptional()
	@Field(() => PeriodsRange, { nullable: true })
	periodsRange?: PeriodsRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class FurnituresInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableFurnitureSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => PISearch)
	search: PISearch;
}

@InputType()
class APISearch {
	@IsOptional()
	@Field(() => FurnitureStatus, { nullable: true })
	furnitureStatus?: FurnitureStatus;
}

@InputType()
export class AgentFurnituresInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableFurnitureSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => APISearch)
	search: APISearch;
}

@InputType()
class ALPISearch {
	@IsOptional()
	@Field(() => FurnitureStatus, { nullable: true })
	furnitureStatus?: FurnitureStatus;

	@IsOptional()
	@Field(() => [FurnitureLocation], { nullable: true })
	furnitureLocationList?: FurnitureLocation[];
}

@InputType()
export class AllFurnituresInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableFurnitureSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ALPISearch)
	search: ALPISearch;
}

@InputType()
export class OrdinaryInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}
