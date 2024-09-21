import { Injectable } from '@nestjs/common';
import { SocialPostStrategy } from '../interfaces/social-post-strategy.interface';

@Injectable()
export class JikePostStrategy implements SocialPostStrategy {
  async post(content: string): Promise<boolean> {
    // 实现即刻发帖逻辑
    console.log('Posting to Jike:', content);
    return true;
  }
}