import { Resolver, Query, Mutation, Args, Int, ResolveReference } from '@nestjs/graphql';
import { StudentService } from './student.service';
import { Student } from './entities/student.entity';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';
import { CreateBulkStudentInput } from './dto/create-bulk-students.input';
import { FetchPaginatedStudentsInput } from './dto/fetch-paginated-students-input';
import { FetchPaginatedStudentsOutput } from './dto/fetch-paginated-students-output';

@Resolver(() => Student)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Mutation(() => Student, { name: 'createStudent' })
  createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput,
  ) {
    return this.studentService.create(createStudentInput);
  }
  @Mutation(() => [Student], { name: 'bulkCreateStudents' })
  bulkCreateStudents(
    @Args('bulkCreateStudents')
    bulkCreateStudents: CreateBulkStudentInput,
  ) {
    return this.studentService.bulkCreate(bulkCreateStudents);
  }
  @Query(() => [Student], { name: 'getAllStudent' })
  findAll() {
    return this.studentService.findAll();
  }

  @Query(() => Student, { name: 'getStudentById' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.studentService.findOne(id);
  }

  @Mutation(() => Student, { name: 'updateStudent' })
  updateStudent(
    @Args('updateStudentInput') updateStudentInput: CreateStudentInput,
    @Args('id') id: number,
  ) {
    return this.studentService.update(id, updateStudentInput);
  }

  @Mutation(() => Student, { name: 'removeStudent' })
  removeStudent(@Args('id', { type: () => Int }) id: number) {
    return this.studentService.remove(id);
  }

  @Query(() => FetchPaginatedStudentsOutput, { name: 'fetchPaginatedStudents' })
  fetchPaginatedStudents(
    @Args('page') page: FetchPaginatedStudentsInput,
  ): Promise<FetchPaginatedStudentsOutput> {
    return this.studentService.fetchPaginatedStudents(page);
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }): Promise<Student> {
    return this.studentService.findOne(reference.id);
  }
}
