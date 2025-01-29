import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBulkStudentInput } from './dto/create-bulk-students.input';
import { CreateStudentInput } from './dto/create-student.input';
import { FetchPaginatedStudentsInput } from './dto/fetch-paginated-students-input';
import { FetchPaginatedStudentsOutput } from './dto/fetch-paginated-students-output';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}
  private readonly logger = new Logger(StudentService.name, {
    timestamp: true,
  });
  // create new student record
  create(createStudentInput: CreateStudentInput): Promise<Student> {
    try {
      this.logger.log('Creating new student started.');
      const student: Student =
        this.studentRepository.create(createStudentInput);
      //  calculate age -> assume dob is not this year
      let age = new Date().getFullYear() - new Date(student.dob).getFullYear();
      student.age = age;
      student.createdAt = new Date();
      const createdStudent = this.studentRepository.save(student);
      this.logger.log('Student created successfully.');
      return createdStudent;
    } catch (error) {
      this.logger.error('Failed to create student: ' + error.message);
      throw new Error('Unable to create student. Please try again later.');
    }
  }
  //  create multiple student records
  bulkCreate(createStudentInput: CreateBulkStudentInput) {
    try {
      this.logger.log('BulkCreate new students started.');
      const students: Student[] = createStudentInput.bulkCreateStudents.map(
        (student: CreateStudentInput) => {
          const singleStd = this.studentRepository.create(student);
          let age =
            new Date().getFullYear() - new Date(singleStd.dob).getFullYear();
          singleStd.age = age;
          singleStd.createdAt = new Date();
          return singleStd;
        },
      );
      const createdStudents = this.studentRepository.save(students);
      this.logger.log('Students created successfully.');
      return createdStudents;
    } catch (error) {
      this.logger.error('Failed to create students: ' + error.message);
      throw new Error('Unable to create students. Please try again later.');
    }
  }
  //  get all students
  findAll(): Promise<Student[]> {
    this.logger.log('Fetching All Students.');
    return this.studentRepository.find();
  }
  //  get student by id
  findOne(id: number): Promise<Student> {
    this.logger.log('Find student for ID: ' + id + '.');
    return this.studentRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateStudentInput: CreateStudentInput,
  ): Promise<Student> {
    try {
      // Fetch the existing student
      const student = await this.studentRepository.findOne({ where: { id } });
      if (!student) {
        throw new Error('Student not found');
      }
      const updateStudent: Student = {
        ...student,
        ...updateStudentInput,
      };
      const age =
        new Date().getFullYear() -
        new Date(updateStudentInput.dob).getFullYear();
      student.age = age;
      student.updatedAt = new Date();
      const updatedStudent = await this.studentRepository.save(updateStudent);
      this.logger.log('Student updated successfully.');

      return updatedStudent;
    } catch (error) {
      this.logger.error('Failed to update student : ' + error.message);
      throw new Error('Unable to update students. Please try again later.');
    }
  }
  //  delete student by id
  remove(id: number): Promise<Student | null> {
    return this.studentRepository
      .findOne({ where: { id: id } })
      .then(async (student) => {
        if (!student) {
          this.logger.error('Failed to delete student : student not found.');
          throw new Error('Student not found');
        }
        const deletedStd = await this.studentRepository.delete(id);
        if (deletedStd.affected === 1) {
          this.logger.log('Student deleted successfully.');
          return student;
        } else {
          throw new Error('Failed to delete student');
        }
      })
      .catch((error) => {
        this.logger.error('Failed to delete student : ' + error.message);
        throw new Error('Unable to delete students. Please try again later.');
      });
  }

  async fetchPaginatedStudents(
    page: FetchPaginatedStudentsInput,
  ): Promise<FetchPaginatedStudentsOutput> {
    try {
      this.logger.log('Fetching paginated students : ' + JSON.stringify(page));
      const [data, count] = await this.studentRepository.findAndCount({
        skip: page.skip > 0 ? page.skip : 0,
        take: page.pageSize,
      });
      return {
        totalPages: Math.ceil(count / page.pageSize),
        current: page.skip,
        pageSize: page.pageSize,
        totalSize: count,
        data: data,
      };
    } catch (error) {
      this.logger.error(
        'Failed to fetch paginated students : ' + error.message,
      );

      return null;
    }
  }
}
