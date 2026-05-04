import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { ProductSpecs } from './products/entities/products-spec.entity';
import { ImagesModule } from './images/images.module';
import { Image } from './images/entities/image.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'hl_shop',
      entities: [User, Product, ProductSpecs, Image],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ProductsModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
