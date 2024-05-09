import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/Auth/decorator';
import { jwtGuard } from 'src/Auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(jwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
    // @UseGuards(AuthGuard('jwt')) use this if auth/guard is not implemented
    // @UseGuards(jwtGuard)
    @Get('me')
    // getMe(@Req() req:Request){  use thos if decorator not implemented
    // getMe(@GetUser('id') userID:number){
    getMe(@GetUser('') user:User){
        return user;
        // return req.user;
    }

    @Patch()
    editUser(
      @GetUser('id') userId: number,
      @Body() dto: EditUserDto,
    ) {
      return this.userService.editUser(userId, dto);
    }

}
