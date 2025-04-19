import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import {
	FurnitureBrand,
	FurnitureColor,
	FurnitureCondition,
	FurnitureLocation,
	FurnitureMaterial,
	FurnitureStatus,
	FurnitureType,
} from '../../enums/furniture.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class FurnitureDimensionsUpdate {
	@Field(() => Int)
	width: number;

	@Field(() => Int)
	height: number;

	@Field(() => Int)
	depth: number;
}

@InputType()
export class FurnitureUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => FurnitureType, { nullable: true })
	furnitureType?: FurnitureType;

	@IsOptional()
	@Field(() => FurnitureStatus, { nullable: true })
	furnitureStatus?: FurnitureStatus;

	@IsOptional()
	@Field(() => FurnitureLocation, { nullable: true })
	furnitureLocation?: FurnitureLocation;

	@Field(() => FurnitureCondition, { nullable: true })
	furnitureCondition?: FurnitureCondition;

	@Field(() => FurnitureDimensionsUpdate, { nullable: true })
	furnitureDimensions?: FurnitureDimensionsUpdate;

	@Field(() => FurnitureColor, { nullable: true })
	furnitureColor?: FurnitureColor;

	@Field(() => FurnitureMaterial, { nullable: true })
	furnitureMaterial?: FurnitureMaterial;

	@Field(() => FurnitureBrand, { nullable: true })
	furnitureBrand?: FurnitureBrand;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	furnitureTitle?: string;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	furniturePrice?: number;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	furnitureImages?: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	furnitureDesc?: string;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	furnitureBarter?: boolean;

	soldAt?: Date;

	deletedAt?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}
