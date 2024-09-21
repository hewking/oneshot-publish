import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SocialPostModule } from './social-post/social-post.module';
import { ItemsModule } from './items/items.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    SocialPostModule,
    ItemsModule,
  ],
})
export class AppModule {}