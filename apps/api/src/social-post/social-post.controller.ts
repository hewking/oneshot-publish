import { Controller, Post, Body, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SocialPostService } from './social-post.service';

@Controller('social-post')
export class SocialPostController {
  constructor(private readonly socialPostService: SocialPostService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('image', 9)) // Allow up to 9 images
  async createPost(@Body('text') text: string, @UploadedFiles() images: Express.Multer.File[]) {
    if (!text || images.length === 0) {
      throw new BadRequestException('Text and at least one image are required');
    }
    await this.socialPostService.createPost(text, images);
    return { success: true };
  }
}