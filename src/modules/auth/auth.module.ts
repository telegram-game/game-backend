import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { AuthController } from './controllers/auth.controller';
import { UserProfileRepository } from './repositories/user-profile.repository';
import { AuthService } from './services/auth.service';
import { UserReferralService } from './services/user-referral.service';
import { UserReferralRepository } from './repositories/user-referral.repository';
import { UserReferralController } from './controllers/user-referral.controller';
@Module({
  imports: [PrismaModule],
  controllers: [AuthController, UserReferralController],
  providers: [UserProfileRepository, UserRepository, UserReferralRepository, AuthService, UserService, UserReferralService],
  exports: [UserService],
})
export class AuthModule {}
