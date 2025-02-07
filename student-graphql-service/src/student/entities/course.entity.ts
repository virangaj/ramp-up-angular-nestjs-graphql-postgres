import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Student } from './student.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Course {
  @Field(() => ID)
  @Directive('@external')
  id: number;
  @Field(() => [Student])
  students: Student[];
}
