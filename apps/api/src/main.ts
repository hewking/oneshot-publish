import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  console.log("All config:", configService.get("port")); // 添加这行来查看所有配置

  const port = configService.get<number>("port");

  app.enableCors();
  await app.listen(port);
  console.log(`应用程序正在运行: ${await app.getUrl()}`);
}
bootstrap();
