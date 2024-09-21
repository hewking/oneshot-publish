import { Controller, Post, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SocialPostService } from './social-post.service';

@Controller('social-post')
export class SocialPostController {
  constructor(private readonly socialPostService: SocialPostService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('image', 9)) // Allow up to 9 images
  async createPost(@Body('text') text: string, @UploadedFiles() images: Express.Multer.File[]) {
    await this.socialPostService.createPost(text, images);
    return { success: true };
  }
}