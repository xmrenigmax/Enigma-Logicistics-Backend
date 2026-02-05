import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. ENABLE CORS (Crucial for React Integration)
  // This allows your frontend (usually on port 5173 or 3001) to talk to this backend
  app.enableCors({
    origin: true, // In production, replace this with your actual frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. GLOBAL VALIDATION
  // This ensures 'email' is actually an email, etc.
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips out properties that aren't in the DTO
    forbidNonWhitelisted: true, // Throws error if extra data is sent
    transform: true,
  }));

  // 3. SWAGGER DOCUMENTATION (The "Oracle Killer" Polish)
  // Access this at http://localhost:3000/api
  const config = new DocumentBuilder()
    .setTitle('Enigma OS API')
    .setDescription('The Autonomous Hospitality Infrastructure')
    .setVersion('1.0')
    .addBearerAuth() // Adds the "Authorize" button for your JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`[SYSTEM_ONLINE] Enigma Core accepting connections on Port 3000`);
  console.log(`[DOCS_ONLINE] Swagger API available at http://localhost:3000/api`);
}
bootstrap();