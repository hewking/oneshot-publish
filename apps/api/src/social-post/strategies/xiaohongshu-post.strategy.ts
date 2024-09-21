import { Injectable } from '@nestjs/common';
import { SocialPostStrategy } from '../interfaces/social-post-strategy.interface';

@Injectable()
export class XiaohongshuPostStrategy implements SocialPostStrategy {
  async post(content: string): Promise<boolean> {
    // 实现小红书发帖逻辑
    console.log('Posting to Xiaohongshu:', content);
    return true;
  }
}