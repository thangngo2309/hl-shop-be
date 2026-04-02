import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signIn(username: string, pass: string): Promise<{ access_token: string, refresh_token?: string }> {
        const user = await this.usersService.findByUsername(username);
        if (!user) throw new UnauthorizedException();

        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.user_id, username: user.username };
        
        return {
            access_token: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                expiresIn: (process.env.JWT_EXPIRES_IN || "10m") as any,
            }),

            refresh_token: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "1d") as any,
            }),
        };
    }

    async refreshToken(
        refreshToken: string,
    ): Promise<{ access_token: string }> {
        try {
            // 1. Verify refresh token
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET
            });

            // 2. (Optional - nên có) kiểm tra user còn tồn tại
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            const user = await this.usersService.findByUsername(payload.username);
            if (!user) throw new UnauthorizedException();

            // 3. Tạo access token mới
            const newPayload = {
                sub: user.user_id,
                username: user.username,
            };

            const access_token = await this.jwtService.signAsync(newPayload, {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                expiresIn: (process.env.JWT_EXPIRES_IN || "10m") as any,
            });

            return { access_token };

        } catch (err: any) {
            console.error('Error refreshing token:', err);
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

}