import { ContactInfo } from './../../models/Achievement/contactInfo.entity';
import { ResultOfCriteria } from './../../models/Achievement/resultOfCriteria.entity';
import { Result } from 'src/models/Achievement/result.entity';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { User } from 'src/models/Achievement/user.entity';
import { ClosureCriteria } from './../../models/Achievement/closureCriteria.entity';
import { Criteria } from './../../models/Achievement/criteria.entity';
import { Achievement } from '../../models/Achievement/achievement.entity';
import { Department } from 'src/models/Achievement/department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ResultService } from './services/result.service';
import { CriteriaService } from './services/criteria.service';
import { CriteriaController } from './controllers/criteria.controller';
import { UserController } from './controllers/user.controller';
import { AchievementService } from './services/achievement.service';
import { AchievementController } from './controllers/achievement.controller';
import { GoogleAuthenticationController } from './controllers/googleAuthentication.controller';
import { GoogleAuthenticationService } from './services/googleAuthentication.service';
import { UsersService } from './services/users.service';
import { AuthenticationService } from './services/authentication.service';
import { DepartmentService } from './services/department.service';
import { DepartmentController } from './controllers/department.controller';
import { AuditorController } from './controllers/auditor.controller';
import { AuditorService } from './services/auditor.service';
import { SubmissionController } from './controllers/submission.controller';
import { SubmissionService } from './services/submission.service';
import { Submission } from 'src/models/Achievement/submission.entity';
import { RolesGuard } from './guard/roles.guard';
import { Auditor } from 'src/models/Achievement/auditor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      Criteria,
      ClosureCriteria,
      User,
      Department,
      ResultOfCriteria,
      Result,
      Submission,
      ContactInfo,
      Auditor
    ]),
    JwtModule.register({}),
    // MulterModule.register({ dest: '../frontend/testUploads' }),
  ],
  providers: [
    AuditorController,
    CriteriaService,
    AchievementService,
    GoogleAuthenticationService,
    UsersService,
    AuthenticationService,
    DepartmentService,
    AuditorService,
    SubmissionService,
    ResultService,
    JwtRefreshTokenStrategy,
    JwtStrategy,
    RolesGuard,
  ],
  controllers: [
    CriteriaController,
    AchievementController,
    GoogleAuthenticationController,
    UserController,
    DepartmentController,
    AuditorController,
    SubmissionController,
  ],
})
export class ApiModule {}
// GoogleAuthenticationService;
