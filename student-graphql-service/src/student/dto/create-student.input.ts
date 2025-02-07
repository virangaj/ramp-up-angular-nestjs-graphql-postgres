import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateStudentInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  gender: string;

  @Field()
  address: string;

  @Field()
  mobileNo: string;

  @Field(() => Date)
  dob: Date;

  @Field()
  courseId: number;

}
