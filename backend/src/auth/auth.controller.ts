import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/registerUserDto';
import { LoginUserDto } from './dtos/loginUserDto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Role } from './role.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body(ValidationPipe) loginUser: LoginUserDto) {
    const user = await this.authService.validateUser(loginUser);
    if (!user) throw new UnauthorizedException('Wrong username or password');

    return this.authService.login(user);
  }

  @Post('register')
  create(@Body(ValidationPipe) registerUser: RegisterUserDto) {
    return this.authService.register(registerUser);
  }

  // Check username availability (public)
  @Get('check-username')
  async checkUsername(@Request() req) {
    const username = req.query?.username;
    if (!username) return { available: false };
    return { available: await this.authService.isUsernameAvailable(username) };
  }

  // Get user profile by username (public)
  @Get('users/:username')
  async getUserByUsername(@Param('username') username: string) {
    return this.authService.getUserByUsername(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // Kendi profilini güncelle (editör ve admin)
  @UseGuards(AuthGuard('jwt'))
  @Put('me')
  async updateOwnProfile(@Request() req, @Body() update: Partial<{ firstName: string, lastName: string, password: string }>) {
    // Sadece kendi hesabını güncelleyebilir
    return this.authService.updateOwnProfile(req.user.id, update);
  }

  // (Removed) DELETE /auth/me permanent deletion endpoint - disabled per user request

  // 🔥 YENİ: Tüm kullanıcıları getir (sadece admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin')
  @Get('all-users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }
}

// 🔥 YENİ CONTROLLER: Admin işlemleri için
@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) { }

  // Tüm kullanıcıları getir
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin')
  @Get('users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  // Kullanıcı rolünü güncelle
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin')
  @Put('users/:id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body('role') role: string,
    @Request() req,
  ) {
    // Admin kendi rolünü değiştiremez
    if (Number(id) === req.user.id) {
      throw new ForbiddenException('Kendi rolünüzü değiştiremezsiniz');
    }
    return this.authService.updateUserRole(Number(id), role);
  }

  // Kullanıcı sil
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin')
  @Delete('users/:id')
  deleteUser(@Param('id') id: string, @Request() req) {
    // Admin kendini silemez
    if (Number(id) === req.user.id) {
      throw new ForbiddenException('Kendinizi silemezsiniz');
    }
    return this.authService.deleteUser(Number(id));
  }
}