import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { json, urlencoded } from "express";
import { setGlobalDispatcher, ProxyAgent } from "undici";

async function bootstrap() {
  // 这行解决了 Apollo Client 的警告
  setGlobalDispatcher(new ProxyAgent({ uri: 'http://localhost' }));

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  console.log("All config:", configService.get("port")); // 添加这行来查看所有配置

  const port = configService.get<number>("port") || 3001;

  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  // 添加 Vercel 支持
  if (process.env.VERCEL) {
    app.setGlobalPrefix('api');
  }
  
  await app.listen(port);
  console.log(`应用程序正在运行: ${await app.getUrl()}`);
}
bootstrap();
