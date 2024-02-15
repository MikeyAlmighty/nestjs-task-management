import { Body, Controller, Logger, Post } from '@nestjs/common';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController')
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void>{
    this.logger.verbose(`Creating new User "${authCredentialsDto.username}"`)
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }>{
    this.logger.verbose(`Signing in with User "${authCredentialsDto.username}"`)
    return this.authService.signIn(authCredentialsDto);
  }
}
