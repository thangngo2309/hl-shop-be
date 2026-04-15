/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Get
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from '../decorators/public.decorator';
// import { Roles } from '../decorators/roles.decorator';
// import { UserRole } from '../enum/users.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() SignInDto: SignInDto) {
    return this.authService.signIn(SignInDto.username, SignInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req ) {
    return this.authService.getProfile(req.user.sub);
  }

  @Public()
  @Post('refresh')
  refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout() {
    return { message: 'Logged out successfully' };
  }
}
