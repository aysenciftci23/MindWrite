import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dtos/registerUserDto';
import { LoginUserDto } from './dtos/loginUserDto';
import { Post } from '../posts/posts.entity';
import { Comment } from '../comments/comment.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    private jwtService: JwtService,
  ) { }

  async validateUser(loginUser: LoginUserDto) {
    const user = await this.usersRepository.findOneBy({
      username: loginUser.username,
    });
    if (!user) return null;
    // prevent inactive users from logging in
    if (user.isActive === false) return null;

    const ok = await bcrypt.compare(loginUser.password, user.password);
    return ok ? user : null;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      accessToken: this.jwtService.sign(payload),
    };
  }

  // backend/src/auth/auth.service.ts
  async register(registerUser: RegisterUserDto) {
    console.log('Register request:', registerUser);
    const user = new User();
    user.username = registerUser.username;
    user.password = bcrypt.hashSync(registerUser.password, 10);
    user.role = registerUser.role || 'editor';
    user.firstName = registerUser.firstName?.trim() || "";
    user.lastName = registerUser.lastName?.trim() || "";

    return this.usersRepository.save(user);
  }

  // 🔥 YENİ METODLAR: Admin işlemleri için

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'username', 'firstName', 'lastName', 'role', 'createdAt', 'isActive'], // Şifreyi döndürme
      order: { id: 'ASC' },
    });
  }

  async updateUserRole(userId: number, newRole: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Geçerli roller kontrolü
    if (!['editor', 'admin'].includes(newRole)) {
      throw new Error('Geçersiz rol');
    }

    user.role = newRole;
    return this.usersRepository.save(user);
  }

  async deleteUser(userId: number): Promise<void> {
    // Use a direct update to avoid loading relations and to provide clearer errors
    try {
      const result = await this.usersRepository.update(userId, {
        isActive: false,
        deletedAt: new Date(),
      });

      if (result.affected === 0) {
        throw new NotFoundException('Kullanıcı bulunamadı');
      }
    } catch (err) {
      // Log full error and stack for debugging
      console.error('deleteUser error:', err);
      if (err && err.stack) console.error(err.stack);
      // If it's a NotFoundException, rethrow; otherwise wrap to give clearer 500 message
      if (err instanceof NotFoundException) throw err;
      // Include original error message in response to help debugging during development
      const msg = err?.message ? `Kullanıcı silinirken hata oluştu: ${err.message}` : 'Kullanıcı silinirken hata oluştu';
      throw new InternalServerErrorException(msg);
    }
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ username });
    return !user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'firstName', 'lastName', 'role', 'createdAt'],
    });
    return user || null;
  }

  // (Removed: deleteAccountPermanently) Permanent deletion endpoint is disabled.

  // Kendi profilini güncelle (editör ve admin)
  async updateOwnProfile(userId: number, update: Partial<{ firstName: string, lastName: string, password: string }>): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    if (update.firstName !== undefined) user.firstName = update.firstName.trim();
    if (update.lastName !== undefined) user.lastName = update.lastName.trim();
    if (update.password !== undefined && update.password.length > 0) {
      user.password = bcrypt.hashSync(update.password, 10);
    }
    return this.usersRepository.save(user);
  }
}