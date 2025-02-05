import { Field, ObjectType } from '@nestjs/graphql';
import { Student } from '../entities/student.entity';

@ObjectType()
export class FetchPaginatedStudentsOutput {
  @Field()
  current: number;

  @Field()
  pageSize: number;
  
  @Field()
  totalPages: number;
  
  @Field()
  totalSize: number;
  
  @Field(() => [Student])
  data: Student[];
}
