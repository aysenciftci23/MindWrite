// backend/src/auth/admin.controller.ts
import { Controller, Get, Put, Delete, Param, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './role.decorator';
import { RolesGuard } from './roles.guard';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from './auth.service';

@Controller('admin/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Role('admin')
export class AdminController {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private authService: AuthService,
    ) { }

    // Tüm kullanıcıları listele
    @Get()
    async findAll() {
        return this.usersRepository.find({
            select: ['id', 'username', 'firstName', 'lastName', 'role', 'createdAt', 'isActive'],
            order: { id: 'DESC' },
        });
    }

    // Kullanıcı rolünü güncelle
    @Put(':id/role')
    async updateRole(@Param('id') id: string, @Body('role') role: string) {
        const user = await this.usersRepository.findOneBy({ id: Number(id) });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Sadece 'admin' veya 'editor' rolüne izin ver
        if (role !== 'admin' && role !== 'editor') {
            throw new NotFoundException('Geçersiz rol. Sadece "admin" veya "editor" kabul edilir.');
        }

        user.role = role;
        await this.usersRepository.save(user);

        return {
            message: `Kullanıcı rolü güncellendi`,
            user: { id: user.id, username: user.username, role: user.role }
        };
    }

    // Kullanıcı sil
    @Delete(':id')
    async remove(@Param('id') id: string) {
        const user = await this.usersRepository.findOneBy({ id: Number(id) });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Admin kendini silemesin
        // (Frontend'de de kontrol ediyoruz ama backend'de de güvenlik için)

        await this.authService.deleteUser(Number(id));

        return {
            message: 'Kullanıcı pasifleştirildi',
            user: { id: user.id, username: user.username }
        };
    }
}