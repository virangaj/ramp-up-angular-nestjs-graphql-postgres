import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}
  private readonly logger = new Logger(CourseService.name, {
    timestamp: true,
  });
  create(createCourseInput: CreateCourseInput): Promise<Course> {
    try {
      const course: Course = this.courseRepository.create(createCourseInput);
      const createdCourse = this.courseRepository.save(course);
      return createdCourse;
    } catch (error) {
      this.logger.error('Failed to create course: ' + error.message);
      if (error instanceof BadRequestException) {
        throw error.message;
      }
      throw new Error('Unable to create course. Please try again later.');
    }
  }
  findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  findOne(id: number): Promise<Course> {
    return this.courseRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCourseInput: UpdateCourseInput) {
    try {
      const course = await this.courseRepository.findOne({ where: { id } });
      const updateCourse: Course = {
        ...course,
        ...updateCourseInput,
      };
      const updatedCouse = await this.courseRepository.save(updateCourse);
      return updatedCouse;
    } catch (error) {
      this.logger.error('Failed to update course : ' + error.message);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Unable to update courses. Please try again later.');
    }
  }

  remove(id: number): Promise<Course | null> {
    return this.courseRepository
      .findOne({ where: { id: id } })
      .then(async (course) => {
        if (!course) {
          this.logger.error('Failed to delete course : course not found.');
          throw new Error('course not found');
        }
        const deletedCourse = await this.courseRepository.delete(id);
        if (deletedCourse.affected === 1) {
          this.logger.log('course deleted successfully.');
          return course;
        } else {
          throw new Error('Failed to delete course');
        }
      })
      .catch((error) => {
        this.logger.error('Failed to delete course : ' + error.message);
        throw new Error('Unable to delete course. Please try again later.');
      });
  }
}
