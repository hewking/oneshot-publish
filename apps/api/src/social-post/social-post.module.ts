import { Module } from '@nestjs/common';
import { SocialPostController } from './social-post.controller';
import { SocialPostService } from './social-post.service';
import { TwitterPostStrategy } from './strategies/twitter-post.strategy';
import { XiaohongshuPostStrategy } from './strategies/xiaohongshu-post.strategy';
import { JikePostStrategy } from './strategies/jike-post.strategy';

@Module({
  controllers: [SocialPostController],
  providers: [
    SocialPostService,
    TwitterPostStrategy,
    XiaohongshuPostStrategy,
    JikePostStrategy
  ],
  exports: [SocialPostService]
})
export class SocialPostModule {}