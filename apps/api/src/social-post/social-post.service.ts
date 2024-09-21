import { Injectable } from '@nestjs/common';
import { TwitterApi } from 'twitter-api-v2';
import axios from 'axios';

@Injectable()
export class SocialPostService {
  private twitterClient: TwitterApi;

  constructor() {
    this.twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
  }

  async createPost(text: string, image: Express.Multer.File) {
    // 发布到 Twitter
    const mediaId = await this.twitterClient.v1.uploadMedia(image.buffer, { mimeType: image.mimetype });
    await this.twitterClient.v2.tweet(text, { media: { media_ids: [mediaId] } });

    // 发布到即刻（这里需要根据即刻的 API 进行实现）
    // 示例代码（需要根据实际 API 调整）：
    // await axios.post('https://api.jike.com/1.0/posts/create', {
    //   content: text,
    //   pictureKeys: [uploadedImageKey],  // 假设你已经上传了图片并得到了 key
    // }, {
    //   headers: { 'Authorization': `Bearer ${process.env.JIKE_ACCESS_TOKEN}` }
    // });

    // 发布到小红书（这里需要根据小红书的 API 进行实现）
    // 示例代码（需要根据实际 API 调整）：
    // await axios.post('https://api.xiaohongshu.com/v1/notes', {
    //   title: text.substring(0, 30),  // 假设标题使用文本的前 30 个字符
    //   desc: text,
    //   images: [uploadedImageUrl],  // 假设你已经上传了图片并得到了 URL
    // }, {
    //   headers: { 'Authorization': `Bearer ${process.env.XIAOHONGSHU_ACCESS_TOKEN}` }
    // });
  }
}