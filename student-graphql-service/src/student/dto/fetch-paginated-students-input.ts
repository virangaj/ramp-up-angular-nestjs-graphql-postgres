import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FetchPaginatedStudentsInput {
  @Field()
  current: number;
  @Field()
  pageSize: number;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  address?: string;
}
