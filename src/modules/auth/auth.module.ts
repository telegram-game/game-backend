import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { AuthController } from './controllers/auth.controller';
import { UserProfileRepository } from './repositories/user-profile.repository';
import { AuthService } from './services/auth.service';
@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [UserProfileRepository, UserRepository, AuthService, UserService],
  exports: [UserService],
})
export class AuthModule {}
