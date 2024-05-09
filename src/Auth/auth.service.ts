import { ForbiddenException, Injectable, Req } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService{

    constructor(private prisma : PrismaService, private jwt : JwtService, private config : ConfigService){

    }


    async signup(body : AuthDto){
        // generate the password hash
        const hash = await argon.hash(body.password);

        try {
            // save the new user in db
            const user = await this.prisma.user.create({
            data:{
                email:body.email,
                hash:hash
            },
            // select:{
            //     id:true,
            //     email:true,
            //     firstName:true,
            //     lastName:true
            // }
            
        });
        
        // return the saved user
        // delete user.hash;
        // return user

        return this.signToken(user.id,user.email)


    } catch (error) {
        if(error instanceof PrismaClientKnownRequestError){
            if(error.code === 'P2002'){
                // the above error code is for duplication
                throw new ForbiddenException('Credentials Taken')
            }
        }   
        throw error;
    }
    }




    async signin(body : AuthDto){
        //  find user by email
        const user = await this.prisma.user.findFirst({
            where:{
                email:body.email,
            }
        })

        // if suer does not exist throw exception
        if(!user){
            throw new ForbiddenException('Credentials incorrect')
        }

        // compare passwords
        const pwMatches = await argon.verify(user.hash,body.password)

        // if password incorrect throw exception
        if(!pwMatches) throw new ForbiddenException("Credentials incorrect")

        // send back the user
        // delete user.hash;
        // return user;
        return this.signToken(user.id,user.email)
    }


    async signToken(userId:number,email:string): Promise<{access_token:string}>{
        const payload = {sub:userId,email};

        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(payload,{
            expiresIn:'15m',
            secret:secret
        })

        return {
            access_token : token,
        }
    }


}