import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CourseModule } from './course/course.module';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'pg';

@Module({
  imports: [
    CourseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),
      playground: true,
      introspection: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const client = new Client({
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT, 10),
          user: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          autoLoadEntities: true,
          synchronize: true,
          retryAttempts: 5,
          retryDelay: 5000,
        });

        await client.connect();

        const dbName = process.env.DATABASE_NAME;
        const result = await client.query(
          `SELECT 1 FROM pg_database WHERE datname = $1`,
          [dbName],
        );

        if (result.rows.length === 0) {
          await client.query(`CREATE DATABASE "${dbName}"`);
          console.log(`Database "${dbName}" created successfully.`);
        } else {
          console.log(`Database "${dbName}" already exists.`);
        }

        await client.end();

        return {
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT, 10),
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: dbName,
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
