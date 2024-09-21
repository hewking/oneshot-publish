import { Injectable } from "@nestjs/common";
import { SocialPostStrategy } from "./interfaces/social-post-strategy.interface";

@Injectable()
export class SocialPostService {
  private strategies: Map<string, SocialPostStrategy> = new Map();

  addStrategy(name: string, strategy: SocialPostStrategy) {
    this.strategies.set(name, strategy);
  }

  async postToAll(content: string, images?: Buffer[]): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    for (const [name, strategy] of this.strategies) {
      results[name] = await strategy.post(content, images);
    }
    return results;
  }

  async postToSpecific(platforms: string[], content: string, images?: Buffer[]): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    for (const platform of platforms) {
      const strategy = this.strategies.get(platform);
      if (strategy) {
        results[platform] = await strategy.post(content, images);
      } else {
        results[platform] = false;
      }
    }
    return results;
  }
}
