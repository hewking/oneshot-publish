import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';

@Injectable()
export class SocialPostService {
  private twitterClient: TwitterApi;
  private readonly logger = new Logger(SocialPostService.name);

  constructor(private configService: ConfigService) {
    const twitterConfig = this.configService.get('twitter');
    this.logger.log('Twitter config:', twitterConfig); // 添加日志

    if (!twitterConfig) {
      throw new Error('Twitter configuration is missing');
    }

    if (!twitterConfig.apiKey || !twitterConfig.apiSecret || !twitterConfig.accessToken || !twitterConfig.accessTokenSecret) {
      throw new Error('Twitter API credentials are incomplete');
    }

    this.twitterClient = new TwitterApi({
      appKey: twitterConfig.apiKey,
      appSecret: twitterConfig.apiSecret,
      accessToken: twitterConfig.accessToken,
      accessSecret: twitterConfig.accessTokenSecret,
    });
  }

  async createPost(text: string, images: Express.Multer.File[]) {
    // Handle multiple images (up to 4)
    const mediaIds = await Promise.all(
      images.slice(0, 4).map(image => this.twitterClient.v1.uploadMedia(image.buffer, { mimeType: image.mimetype }))
    );

    // Publish to Twitter
    await this.twitterClient.v2.tweet(text, { 
      media: { 
        media_ids: mediaIds as [string, string, string, string]
      } 
    });

    // Logic for publishing to other platforms can be added here
  }
}