import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Student {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  age: number;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  gender: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  mobileNo: string;

  @Column({ type: 'timestamptz' })
  @Field(() => Date)
  dob: Date;
}
