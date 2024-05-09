import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}

    @Post('/signup')
    // singup(@Req() req:Request){
        singup(@Body() body : AuthDto){
            // console.log(req.body);
            
            return this.authService.signup(body);
        }
        
    // @HttpCode(200)
    @HttpCode(HttpStatus.OK)
    @Post('/signin')
    signin(@Body() body : AuthDto){
        return this.authService.signin(body);
    }

}
