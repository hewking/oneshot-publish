import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';

@Injectable()
export class SocialPostService {
  private twitterClient: TwitterApi;

  constructor(private configService: ConfigService) {
    const twitterConfig = this.configService.get('twitter');
    this.twitterClient = new TwitterApi({
      appKey: twitterConfig.apiKey,
      appSecret: twitterConfig.apiSecret,
      accessToken: twitterConfig.accessToken,
      accessSecret: twitterConfig.accessTokenSecret,
    });
  }

  async createPost(text: string, images: Express.Multer.File[]) {
    // 处理多个图片
    const mediaIds = await Promise.all(
      images.map(image => this.twitterClient.v1.uploadMedia(image.buffer, { mimeType: image.mimetype }))
    );

    // 发布到 Twitter
    await this.twitterClient.v2.tweet(text, { media: { media_ids: mediaIds } });

    // 这里可以添加发布到其他平台的逻辑
  }
}