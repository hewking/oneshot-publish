import { Injectable } from "@nestjs/common";
import { TwitterApi } from "twitter-api-v2";
import { SocialPostStrategy } from "../interfaces/social-post-strategy.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TwitterPostStrategy implements SocialPostStrategy {
  private twitterClient: TwitterApi;

  constructor(private configService: ConfigService) {
    this.twitterClient = new TwitterApi({
      appKey: this.configService.get<string>("TWITTER_API_KEY"),
      appSecret: this.configService.get<string>("TWITTER_API_SECRET"),
      accessToken: this.configService.get<string>("TWITTER_ACCESS_TOKEN"),
      accessSecret: this.configService.get<string>("TWITTER_ACCESS_TOKEN_SECRET"),
    });
  }

  async post(content: string, images?: Buffer[]): Promise<boolean> {
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
      return true;
    } catch (error) {
      console.error("Error posting to Twitter:", error);
      return false;
    }
  }
}
