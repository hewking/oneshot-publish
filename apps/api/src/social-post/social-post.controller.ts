import { Controller, Post, Body, Inject, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SocialPostService } from './social-post.service';
import { TwitterPostStrategy } from './strategies/twitter-post.strategy';
import { XiaohongshuPostStrategy } from './strategies/xiaohongshu-post.strategy';
import { JikePostStrategy } from './strategies/jike-post.strategy';

@Controller('social-post')
export class SocialPostController {
  constructor(
    private readonly socialPostService: SocialPostService,
    @Inject(TwitterPostStrategy) private twitterStrategy: TwitterPostStrategy,
    @Inject(XiaohongshuPostStrategy) private xiaohongshuStrategy: XiaohongshuPostStrategy,
    @Inject(JikePostStrategy) private jikeStrategy: JikePostStrategy,
  ) {
    this.socialPostService.addStrategy('twitter', this.twitterStrategy);
    this.socialPostService.addStrategy('xiaohongshu', this.xiaohongshuStrategy);
    this.socialPostService.addStrategy('jike', this.jikeStrategy);
  }

  @Post('all')
  @UseInterceptors(FilesInterceptor('images'))
  async postToAll(
    @Body('content') content: string,
    @UploadedFiles() images?: Express.Multer.File[]
  ) {
    const imageBuffers = images ? images.map(file => file.buffer) : undefined;
    return this.socialPostService.postToAll(content, imageBuffers);
  }

  @Post('specific')
  @UseInterceptors(FilesInterceptor('images'))
  async postToSpecific(
    @Body('platforms') platforms: string[],
    @Body('content') content: string,
    @UploadedFiles() images?: Express.Multer.File[]
  ) {
    const imageBuffers = images ? images.map(file => file.buffer) : undefined;
    return this.socialPostService.postToSpecific(platforms, content, imageBuffers);
  }
}