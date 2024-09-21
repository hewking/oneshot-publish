import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { SocialPostController } from './social-post/social-post.controller';
import { SocialPostService } from './social-post/social-post.service';

@Module({
  imports: [],
  controllers: [ItemsController, SocialPostController],
  providers: [ItemsService, SocialPostService],
})
export class AppModule {}