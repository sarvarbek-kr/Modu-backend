import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { FurnitureService } from './furniture.service';
import { Furnitures, Furniture } from '../../libs/dto/furniture/furniture';
import {
	AgentFurnituresInquiry,
	AllFurnituresInquiry,
	OrdinaryInquiry,
	FurnituresInquiry,
	FurnitureInput,
} from '../../libs/dto/furniture/furniture.input';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { FurnitureUpdate } from '../../libs/dto/furniture/furniture.update';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class FurnitureResolver {
	constructor(private readonly furnitureService: FurnitureService) {}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Furniture)
	public async createFurniture(
		@Args('input') input: FurnitureInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Furniture> {
		console.log('Mutation: createFurniture');
		input.memberId = memberId;
		return await this.furnitureService.createFurniture(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Furniture)
	public async getFurniture(
		@Args('furnitureId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Furniture> {
		console.log('Query: getFurniture');
		const furnitureId = shapeIntoMongoObjectId(input);
		return await this.furnitureService.getFurniture(memberId, furnitureId);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Furniture)
	public async updateFurniture(
		@Args('input') input: FurnitureUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Furniture> {
		console.log('Mutation: updateFurniture');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.furnitureService.updateFurniture(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Furnitures)
	public async getFurnitures(
		@Args('input') input: FurnituresInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Furnitures> {
		console.log('Query: getFurnitures');
		return await this.furnitureService.getFurnitures(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Furnitures)
	public async getVisited(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Furnitures> {
		console.log('Query: getVisited');
		return await this.furnitureService.getVisited(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Furnitures)
	public async getFavorites(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Furnitures> {
		console.log('Query: getFavorites');
		return await this.furnitureService.getFavorites(memberId, input);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query((returns) => Furnitures)
	public async getAgentFurnitures(
		@Args('input') input: AgentFurnituresInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Furnitures> {
		console.log('Query: getAgentFurnitures');
		return await this.furnitureService.getAgentFurnitures(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Furniture)
	public async likeTargetFurniture(
		@Args('FurnitureId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Furniture> {
		console.log('Mutation: likeTargetFurniture');
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.furnitureService.likeTargetFurniture(memberId, likeRefId);
	}

	/***    ADMIN  * */

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => Furnitures)
	public async getAllFurnituresByAdmin(
		@Args('input') input: AllFurnituresInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Furnitures> {
		console.log('Query: getAllFurnituresByAdmin');
		return await this.furnitureService.getAllFurnituresByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Furniture)
	public async updateFurnitureByAdmin(@Args('input') input: FurnitureUpdate): Promise<Furniture> {
		console.log('Mutation: updateFurnitureByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.furnitureService.updateFurnitureByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Furniture)
	public async removeFurnitureByAdmin(@Args('furnitureId') input: string): Promise<Furniture> {
		console.log('Mutation: removeFurnitureByAdmin');
		const furnitureId = shapeIntoMongoObjectId(input);
		return await this.furnitureService.removeFurnitureByAdmin(furnitureId);
	}
}
