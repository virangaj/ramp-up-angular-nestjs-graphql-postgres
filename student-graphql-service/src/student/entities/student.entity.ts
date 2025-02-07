import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './course.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class Student {
  @Field(() => ID)
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

  @Column({ type: 'timestamptz' })
  @Field(() => Date)
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(()=> Course)
  course: Course;

  @Column()
  @Field()
  courseId: number;
}
