import { Injectable, Logger } from "@nestjs/common";
import { SocialPostStrategy } from "./interfaces/social-post-strategy.interface";

@Injectable()
export class SocialPostService {
  private strategies: Map<string, SocialPostStrategy> = new Map();
  private readonly logger = new Logger(SocialPostService.name);

  addStrategy(name: string, strategy: SocialPostStrategy) {
    this.strategies.set(name, strategy);
    this.logger.log(`Strategy added: ${name}`);
  }

  async postToAll(content: string, images?: Buffer[]): Promise<Record<string, boolean>> {
    this.logger.log(`Posting to all platforms. Content: ${content.substring(0, 50)}...`);
    const postPromises: Promise<[string, boolean]>[] = [];

    for (const [name, strategy] of this.strategies) {
      postPromises.push(
        this.postToSinglePlatform(name, strategy, content, images)
      );
    }

    const results = await Promise.all(postPromises);
    const resultObject = Object.fromEntries(results);

    this.logger.log(`Finished posting to all platforms. Results: ${JSON.stringify(resultObject)}`);
    return resultObject;
  }

  private async postToSinglePlatform(
    name: string, 
    strategy: SocialPostStrategy, 
    content: string, 
    images?: Buffer[]
  ): Promise<[string, boolean]> {
    this.logger.log(`Attempting to post to ${name}`);
    try {
      const result = await strategy.post(content, images);
      this.logger.log(`Posted to ${name}: ${result}`);
      return [name, result];
    } catch (error) {
      this.logger.error(`Error posting to ${name}: ${error.message}`);
      return [name, false];
    }
  }

  async postToSpecific(platforms: string[], content: string, images?: Buffer[]): Promise<Record<string, boolean>> {
    this.logger.log(`Posting to specific platforms: ${platforms.join(', ')}. Content: ${content.substring(0, 50)}...`);
    const postPromises: Promise<[string, boolean]>[] = [];

    for (const platform of platforms) {
      const strategy = this.strategies.get(platform);
      if (strategy) {
        postPromises.push(
          this.postToSinglePlatform(platform, strategy, content, images)
        );
      } else {
        this.logger.warn(`No strategy found for platform: ${platform}`);
        postPromises.push(Promise.resolve([platform, false]));
      }
    }

    const results = await Promise.all(postPromises);
    const resultObject = Object.fromEntries(results);

    this.logger.log(`Finished posting to specific platforms. Results: ${JSON.stringify(resultObject)}`);
    return resultObject;
  }
}
