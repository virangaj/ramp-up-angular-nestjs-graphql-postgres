import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Course } from './entities/course.entity';
import { StudentService } from './student.service';
import { Student } from './entities/student.entity';
import { Logger } from '@nestjs/common';

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly studentService: StudentService) {}
private readonly logger = new Logger(CourseResolver.name, {
    timestamp: true,
  });
  @ResolveField((of)=> [Student])
  students(@Parent() course: Course): Promise<Student[]> {
    this.logger.log(`CourseResolver.students ${course.id}`)
    return this.studentService.forCourse(course.id);
  }
}
