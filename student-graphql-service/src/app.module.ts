import { ApolloDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Client } from 'pg';
import { DateTimeScalar } from './graphql/scalars/date-time.scalar';
import { StudentModule } from './student/student.module';
import { Course } from './student/entities/course.entity';
@Module({
  imports: [
    StudentModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphsql-schema.gql'),
      playground: true,
      introspection: true,
      buildSchemaOptions: { orphanedTypes: [Course] },
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
  providers: [DateTimeScalar],
})
export class AppModule {}
