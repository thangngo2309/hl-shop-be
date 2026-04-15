import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          expiresIn: (process.env.JWT_EXPIRES_IN || "10m") as any,
        },
      }),
    }),
  ],
  providers: [AuthService,
   {provide: APP_GUARD, useClass: AuthGuard},
   {provide: APP_GUARD, useClass: RolesGuard} 
  ],
  controllers: [AuthController],
})
export class AuthModule {}
