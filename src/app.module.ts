import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AccountsController } from './modules/accounts/accounts.controller';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    ),
    UsersModule,
    AccountsModule
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
