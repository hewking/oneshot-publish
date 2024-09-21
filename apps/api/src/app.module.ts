import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { SocialPostController } from './social-post/social-post.controller';
import { SocialPostService } from './social-post/social-post.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [ItemsController, SocialPostController],
  providers: [ItemsService, SocialPostService],
})
export class AppModule {}