import { Injectable, Logger } from "@nestjs/common";
import { TwitterApi } from "twitter-api-v2";
import { SocialPostStrategy } from "../interfaces/social-post-strategy.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TwitterPostStrategy implements SocialPostStrategy {
  private twitterClient: TwitterApi;
  private readonly logger = new Logger(TwitterPostStrategy.name);

  constructor(private configService: ConfigService) {
    const twitterConfig = this.configService.get('twitter');
    if (!twitterConfig) {
      throw new Error('Twitter configuration is missing');
    }
    
    this.twitterClient = new TwitterApi({
      appKey: twitterConfig.apiKey,
      appSecret: twitterConfig.apiSecret,
      accessToken: twitterConfig.accessToken,
      accessSecret: twitterConfig.accessTokenSecret,
    });
  }

  async post(content: string, images?: Buffer[]): Promise<boolean> {
    this.logger.log(`Attempting to post to Twitter. Content: ${content.substring(0, 50)}...`);
    try {
      if (images && images.length > 0) {
        const mediaIds = await Promise.all(
          images.map((image) => this.twitterClient.v1.uploadMedia(image, { mimeType: 'image/jpeg' }))
        );
        await this.twitterClient.v2.tweet({
          text: content,
          media: { media_ids: mediaIds as [string, string, string, string] },
        });
      } else {
        await this.twitterClient.v2.tweet(content);
      }
      this.logger.log('Successfully posted to Twitter');
      return true;
    } catch (error) {
      this.logger.error(`Error posting to Twitter: ${error.message}`);
      return false;
    }
  }
}
