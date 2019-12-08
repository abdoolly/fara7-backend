import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { AccountsModule } from './modules/accounts/accounts.module';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { BadRequestExceptionFilter } from './Exceptions/bad-request-exc.filter';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
      { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
    ),
    I18nModule.forRoot({
      path: path.join(__dirname, 'config/localization'),
      filePattern: '*.json',
      fallbackLanguage: 'en',
      saveMissing: false,
      resolvers: [
        new QueryResolver(['lang', 'locale', 'l']),
        new HeaderResolver()
      ]
    }),
    UsersModule,
    AccountsModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: BadRequestExceptionFilter },
  ],
  exports: [UsersModule, AccountsModule]
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
