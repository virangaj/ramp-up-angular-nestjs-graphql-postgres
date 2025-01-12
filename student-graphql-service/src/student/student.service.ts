import { Injectable, Logger } from '@nestjs/common';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { CreateBulkStudentInput } from './dto/create-bulk-students.input';

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
      const student: Student =
        this.studentRepository.create(createStudentInput);
      //  calculate age -> assume dob is not this year
      let age = new Date().getFullYear() - new Date(student.dob).getFullYear();
      student.age = age;
      const createdStudent = this.studentRepository.save(student);
      this.logger.log('Student created successfully.');
      return createdStudent;
    } catch (error) {
      this.logger.error('Failed to create student: ' + error.message);
    }
  }
  //  create multiple student records
  bulkCreate(createStudentInput: CreateBulkStudentInput) {
    try {
      const students: Student[] = createStudentInput.bulkCreateStudents.map(
        (student: CreateStudentInput) => {
          const singleStd = this.studentRepository.create(student);
          let age =
            new Date().getFullYear() - new Date(singleStd.dob).getFullYear();
          singleStd.age = age;
          return singleStd;
        },
      );
      const createdStudents = this.studentRepository.save(students);
      this.logger.log('Students created successfully.');
      return createdStudents;
    } catch (error) {
      this.logger.error('Failed to create students: ' + error.message);
    }
  }
  //  get all students
  findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }
  //  get student by id
  findOne(id: number): Promise<Student> {
    return this.studentRepository.findOne({ where: { id } });
  }

  update(id: number, updateStudentInput: CreateStudentInput): Promise<Student> {
    try {
      const student: Student =
        this.studentRepository.create(updateStudentInput);
      student.id = id;
      const updatedStudent = this.studentRepository.save(student);
      this.logger.log('Student updated successfully.');
      return updatedStudent;
    } catch (error) {
      this.logger.error('Failed to update student : ' + error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
