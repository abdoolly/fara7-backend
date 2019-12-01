import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    ),
    UsersModule
  ]
})
export class AppModule {
  // export class AppModule implements NestModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthMiddleware)
  //     .exclude(
  //       { path: 'login', method: RequestMethod.POST },
  //       { path: 'register', method: RequestMethod.POST },
  //     ).forRoutes(UsersController, AuthController)
  // }
}
