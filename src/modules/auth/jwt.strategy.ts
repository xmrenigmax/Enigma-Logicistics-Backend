import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // FIX: Add a fallback so TypeScript knows it's never undefined
      secretOrKey: config.get<string>('JWT_SECRET') || 'ENIGMA_SUPER_SECRET_KEY_2026', 
    });
  }

  async validate(payload: any) {
    // This inserts the 'user' object into 'req.user'
    return { id: payload.sub, email: payload.username, role: payload.role };
  }
}