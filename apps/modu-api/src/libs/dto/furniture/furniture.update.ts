import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { FurnitureLocation, FurnitureStatus, FurnitureType } from '../../enums/furniture.enum';
import { ObjectId } from 'mongoose';

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

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	furnitureAddress?: string;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	furnitureTitle?: string;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	furniturePrice?: number;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	furnitureSquare?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Field(() => Int, { nullable: true })
	furnitureBeds?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Field(() => Int, { nullable: true })
	furnitureRooms?: number;

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

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	furnitureRent?: boolean;

	soldAt?: Date;

	deletedAt?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}
