/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Kiểm tra nếu route có decorator @Public thì bỏ qua kiểm tra token
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu route là public thì cho phép truy cập
    if (isPublic) {
      return true;
    }

    // Nếu không phải route public thì kiểm tra token
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      // Nếu không có token, trả về lỗi
      throw new UnauthorizedException();
    }
    try {
      // Kiểm tra token có hợp lệ không
      const payload = await this.jwtService.verifyAsync(token);
      // nếu đúng thì gán payload vào request để đi tiếp
      request['user'] = payload;
    } catch {
      // Nếu token không hợp lệ, trả về lỗi 
      throw new UnauthorizedException();
    }
    return true;
  }

  // Tách token từ header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
