import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'pg';
import { DateTimeScalar } from './graphql/scalars/date-time.scalar';
@Module({
  imports: [
    StudentModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphsql-schema.gql'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        // Ensure the database exists before proceeding
        const client = new Client({
          host: 'localhost',
          port: 5432,
          user: 'postgres',
          password: '123456',
        });

        await client.connect();

        const dbName = 'rampup_students';
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
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '123456',
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
