import { Schema } from 'mongoose';
import { FurnitureLocation, FurnitureStatus, FurnitureType } from '../libs/enums/furniture.enum';

const FurnitureSchema = new Schema(
	{
		furnitureType: {
			type: String,
			enum: FurnitureType,
			required: true,
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

		furnitureAddress: {
			type: String,
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

		furnitureSquare: {
			type: Number,
			required: true,
		},

		furnitureBeds: {
			type: Number,
			required: true,
		},

		furnitureRooms: {
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

		furnitureRent: {
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
