import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SocialPostService } from './social-post.service';

@Controller('social-post')
export class SocialPostController {
  constructor(private readonly socialPostService: SocialPostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createPost(@Body('text') text: string, @UploadedFile() image: Express.Multer.File) {
    await this.socialPostService.createPost(text, image);
    return { success: true };
  }
}