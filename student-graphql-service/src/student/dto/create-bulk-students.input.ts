import { Field, InputType } from '@nestjs/graphql';
import { CreateStudentInput } from './create-student.input';

@InputType()
export class CreateBulkStudentInput {
  @Field(() => [CreateStudentInput])
  bulkCreateStudents: CreateStudentInput[];
}
