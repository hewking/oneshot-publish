import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { json, urlencoded } from "express";
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

let app: express.Express;

async function bootstrap() {
  if (!app) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    const configService = nestApp.get(ConfigService);

    nestApp.enableCors();
    nestApp.use(json({ limit: "50mb" }));
    nestApp.use(urlencoded({ extended: true, limit: "50mb" }));

    nestApp.setGlobalPrefix("api");

    await nestApp.init();
    app = expressApp;
  }
  return app;
}

export default async (req: express.Request, res: express.Response) => {
  const server = await bootstrap();
  server(req, res);
};
