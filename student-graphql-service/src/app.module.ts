import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'pg';
import { DateTimeScalar } from './graphql/scalars/date-time.scalar';
@Module({
  imports: [
    StudentModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphsql-schema.gql'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        // Ensure the database exists before proceeding
        const client = new Client({
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT, 10),
          user: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
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
          synchronize: true, // Sync schema automatically (for development)
        };
      },
    }),
  ],
  controllers: [],
  providers: [DateTimeScalar],
})
export class AppModule {}
