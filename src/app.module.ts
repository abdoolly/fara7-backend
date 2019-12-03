import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsModule } from './modules/accounts/accounts.module';
import { UsersModule } from './modules/users/users.module';
import { I18nModule, QueryResolver, HeaderResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    ),
    I18nModule.forRoot({
      path: path.join(__dirname, '/src/config/localization'),
      filePattern: '*.json',
      fallbackLanguage: 'en',
      resolvers: [
        new QueryResolver(['lang', 'locale', 'l']),
        new HeaderResolver()
      ]
    }),
    UsersModule,
    AccountsModule,
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
