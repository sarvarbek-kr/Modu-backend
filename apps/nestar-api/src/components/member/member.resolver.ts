import { Args, Mutation, Query,Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards} from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';


@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService) {}

    @Mutation(() => Member)
    public async signup(@Args("input") input: MemberInput): Promise<Member> {
          console.log("Mutation: signup");
          return this.memberService.signup(input);
    }


    @Mutation(() => Member)
    public async login(@Args("input") input: LoginInput): Promise<Member> {
          console.log("Mutation: login");
          return this.memberService.login(input);
      }

      ///  Authenticated  ( USER AGENT ADMIN )

    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async updateMember(
        @Args('input') input: MemberUpdate,
        @AuthMember("_id") memberId: ObjectId
    ): Promise<Member> {
        console.log("Mutation: updateMember");
        delete input._id;
        return this.memberService.updateMember(memberId, input);
    }

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

    @Query(() => String)
    public async getMember(): Promise<string> {
        console.log("Query: getMember");
        return this.memberService.getMember();
    }

    /* ADMIN */

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => String)
    public async getAllMembersByAdmin(): Promise<string> {
        return this.memberService.getAllMembersByAdmin();
    }

    // Authorization: ADMIN
    @Mutation(() => String)
    public async updateMembersByAdmin(): Promise<string> {
        console.log("Mutation: updateMembersByAdmin");
        return this.memberService.updateMembersByAdmin();
    }

}
