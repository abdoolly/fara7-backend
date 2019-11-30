import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './middlewares/Auth';
import { UsersController } from './users/users.controller';
import { AuthController } from './users/auth.controller';
let result = require('dotenv').config();
if (result.error) {
  throw result.error;
}

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    ),
    UsersModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'login', method: RequestMethod.POST },
        { path: 'register', method: RequestMethod.POST },
      ).forRoutes(UsersController, AuthController)
  }
}
