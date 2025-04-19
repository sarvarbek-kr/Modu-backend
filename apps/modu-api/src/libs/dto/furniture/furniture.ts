import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import {
	FurnitureBrand,
	FurnitureColor,
	FurnitureCondition,
	FurnitureLocation,
	FurnitureMaterial,
	FurnitureStatus,
	FurnitureType,
} from '../../enums/furniture.enum';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

@ObjectType()
export class FurnitureDimensions {
	@Field(() => Int)
	width: number;

	@Field(() => Int)
	height: number;

	@Field(() => Int)
	depth: number;
}

@ObjectType()
export class Furniture {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => FurnitureType)
	furnitureType: FurnitureType;

	@Field(() => FurnitureStatus)
	furnitureStatus: FurnitureStatus;

	@Field(() => FurnitureLocation)
	furnitureLocation: FurnitureLocation;

	@Field(() => FurnitureCondition)
	furnitureCondition: FurnitureCondition;

	@Field(() => FurnitureDimensions)
	furnitureDimensions: FurnitureDimensions;

	@Field(() => FurnitureColor)
	furnitureColor: FurnitureColor;

	@Field(() => FurnitureMaterial)
	furnitureMaterial: FurnitureMaterial;

	@Field(() => FurnitureBrand)
	furnitureBrand: FurnitureBrand;

	@Field(() => String)
	furnitureTitle: string;

	@Field(() => Number)
	furniturePrice: number;

	@Field(() => Int)
	furnitureViews: number;

	@Field(() => Int)
	furnitureLikes: number;

	@Field(() => Int)
	furnitureComments: number;

	@Field(() => Int)
	furnitureRank: number;

	@Field(() => [String], { nullable: true })
	furnitureImages: string[];

	@Field(() => String, { nullable: true })
	furnitureDesc?: string;

	@Field(() => Boolean)
	furnitureBarter: boolean;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	soldAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date, { nullable: true })
	constructedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation */

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Furnitures {
	@Field(() => [Furniture])
	list: Furniture[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
