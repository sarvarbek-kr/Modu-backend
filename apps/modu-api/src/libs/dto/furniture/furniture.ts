import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { FurnitureLocation, FurnitureStatus, FurnitureType } from '../../enums/furniture.enum';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

@ObjectType()
export class Furniture {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => FurnitureType)
	furnitureType: FurnitureType;

	@Field(() => FurnitureStatus)
	furnitureStatus?: FurnitureStatus;

	@Field(() => FurnitureLocation)
	furnitureLocation: FurnitureLocation;

	@Field(() => String)
	furnitureAddress: string;

	@Field(() => String)
	furnitureTitle: string;

	@Field(() => Number)
	furniturePrice: number;

	@Field(() => Number)
	furnitureSquare: number;

	@Field(() => Int)
	furnitureBeds: number;

	@Field(() => Int)
	furnitureRooms: number;

	@Field(() => Int)
	furnitureViews: number;

	@Field(() => Int)
	furnitureLikes: number;

	@Field(() => Int)
	furnitureComments: number;

	@Field(() => Int)
	furnitureRank: number;

	@Field(() => [String])
	furnitureImages: string[];

	@Field(() => String, { nullable: true })
	furnitureDesc?: string;

	@Field(() => Boolean)
	furnitureBarter: boolean;

	@Field(() => Boolean)
	furnitureRent: boolean;

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
