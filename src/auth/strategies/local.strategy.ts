import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local'
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
      super({
        usernameField: 'email',
        passwordField: 'password'
      })
    }

  async validate(inputEmail: string, password: string) {
    console.log('Inside LocalStrategy');
    const user = await this.authService.validateUser({ inputEmail, password });
    if (!user) {
      throw new UnauthorizedException()
    };
    console.log(user);
    return user;
  }
}