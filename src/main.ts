import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as process from "node:process";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.MFILES_CORS_URL?.split(',') || [];
  console.log(`allowed origings: ${allowedOrigins}`)
  app.enableCors({
    origin: allowedOrigins,
  })
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
