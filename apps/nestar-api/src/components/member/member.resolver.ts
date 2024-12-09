import { Args, Mutation, Query,Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards} from '@nestjs/common';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';


@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService) {}

    @Mutation(() => Member)
    public async signup(@Args("input") input: MemberInput): Promise<Member> {
          console.log("Mutation: signup");
          return await  this.memberService.signup(input);
    }


    @Mutation(() => Member)
    public async login(@Args("input") input: LoginInput): Promise<Member> {
          console.log("Mutation: login");
          return await  this.memberService.login(input);
      }

      ///  Authenticated  ( USER AGENT ADMIN )

    @UseGuards(AuthGuard)
    @Mutation(() => String)
    public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
        console.log('Quiery: checkAuth');
        console.log('memberNick:', memberNick);
        return `Hi ${memberNick}`;
    }

    @Roles(MemberType.USER, MemberType.AGENT)
    @UseGuards(RolesGuard)
    @Mutation(() => String)
    public async checkAuthRoles(@AuthMember() authmember: Member): Promise<string> {
        console.log('Quiery: checkAuthRoles');
        return `Hi ${authmember.memberNick}, you are ${authmember.memberType} (memberId: ${authmember._id})`;
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async updateMember(
        @Args('input') input: MemberUpdate,
        @AuthMember("_id") memberId: ObjectId
    ): Promise<Member> {
        console.log("Mutation: updateMember");
        delete input._id;
        return await  this.memberService.updateMember(memberId, input);
    }

    @UseGuards(WithoutGuard)
    @Query(() => Member)
    public async getMember(@Args("memberId") input: string, @AuthMember('_id') memberId: ObjectId): Promise<Member> {
        console.log("Query: getMember");
        const targetId = shapeIntoMongoObjectId(input);
        return await this.memberService.getMember(memberId, targetId);
    }

    @UseGuards(WithoutGuard)
    @Query(() => Members)
    public async getAgents(@Args("input") input: AgentsInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Members> {
        console.log("Query: getAgents");
        return await this.memberService.getAgents(memberId, input);
    }

    /* ADMIN */

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Query(() => Members)
    public async getAllMembersByAdmin(@Args("input") input: MembersInquiry): Promise<Members> {
        console.log("Query: getAllMembersByAdmin");
        return await this.memberService.getAllMembersByAdmin(input);
    }

    // Authorization: ADMIN
    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => Member)
    public async updateMembersByAdmin(@Args('input') input: MemberUpdate): Promise<Member> {
        console.log("Mutation: updateMembersByAdmin");
        return await this.memberService.updateMembersByAdmin(input);
    }

}
