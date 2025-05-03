import { LinkedinModule } from '@jobie/linkedin';
import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [LinkedinModule.register()],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule { }
