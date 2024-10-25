import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { JWT_SECRET } from "../constants";
import { UnauthorizedException } from "@nestjs/common";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET
        })
    }

    validate(payload: any) {
        console.log('Inside JWT strategy validate');
        console.log(payload);
        if (!payload) {
            throw new UnauthorizedException('Invalid JWT payload');
        }
        return payload;
    }
}

// This code just typically extracted, verified and decoded the JWT token, 
// without further validating it in the validate() method