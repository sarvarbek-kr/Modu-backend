import { Schema } from 'mongoose';
import {
	FurnitureBrand,
	FurnitureColor,
	FurnitureCondition,
	FurnitureLocation,
	FurnitureMaterial,
	FurnitureStatus,
	FurnitureType,
} from '../libs/enums/furniture.enum';

const FurnitureSchema = new Schema(
	{
		furnitureType: {
			type: String,
			enum: FurnitureType,
			required: true,
		},

		furnitureDimensions: {
			type: {
				width: { type: Number, required: true },
				height: { type: Number, required: true },
				depth: { type: Number, required: true },
			},
			required: true,
		},

		furnitureCondition: {
			type: String,
			enum: FurnitureCondition,
		},

		furnitureStatus: {
			type: String,
			enum: FurnitureStatus,
			default: FurnitureStatus.ACTIVE,
		},

		furnitureLocation: {
			type: String,
			enum: FurnitureLocation,
			required: true,
		},

		furnitureColor: {
			type: String,
			enum: FurnitureColor,
			required: true,
		},

		furnitureMaterial: {
			type: String,
			enum: FurnitureMaterial,
			required: true,
		},

		furnitureBrand: {
			type: String,
			enum: FurnitureBrand,
			required: true,
		},

		furnitureTitle: {
			type: String,
			required: true,
		},

		furniturePrice: {
			type: Number,
			required: true,
		},

		furnitureViews: {
			type: Number,
			default: 0,
		},

		furnitureLikes: {
			type: Number,
			default: 0,
		},

		furnitureComments: {
			type: Number,
			default: 0,
		},

		furnitureRank: {
			type: Number,
			default: 0,
		},

		furnitureImages: {
			type: [String],
			required: true,
		},

		furnitureDesc: {
			type: String,
		},

		furnitureBarter: {
			type: Boolean,
			default: false,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		soldAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},

		constructedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'furnitures' },
);

FurnitureSchema.index(
	{ furnitureType: 1, furnitureLocation: 1, furnitureTitle: 1, furniturePrice: 1 },
	{ unique: true },
);

export default FurnitureSchema;
