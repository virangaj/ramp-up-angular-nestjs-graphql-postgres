import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { CreateStudentInput } from './dto/create-student.input';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { CreateBulkStudentInput } from './dto/create-bulk-students.input';
import { FetchPaginatedStudentsInput } from './dto/fetch-paginated-students-input';
import { FetchPaginatedStudentsOutput } from './dto/fetch-paginated-students-output';
import { Logger } from '@nestjs/common';

describe('StudentService', () => {
  let service: StudentService;
  let studentRepository: Repository<Student>;
  const studentInput: CreateStudentInput = {
    name: 'saman',
    email: 'saman@gmail.com',
    gender: 'male',
    address: 'No. 53, Galle Road, Dehiwala',
    mobileNo: '0715586362',
    dob: new Date('1996-02-25'),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        Logger,
        {
          provide: getRepositoryToken(Student),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentRepository = module.get<Repository<Student>>(
      getRepositoryToken(Student),
    );
  });

  describe('Create Student', () => {
    it('Should create a student', async () => {
      const createdStudent: Student = {
        id: 1,
        age: 0,
        createdAt: undefined,
        updatedAt: undefined,
        ...studentInput,
      };

      jest.spyOn(studentRepository, 'create').mockReturnValue(createdStudent);
      const expectedAge =
        new Date().getFullYear() - studentInput.dob.getFullYear();
      createdStudent.age = expectedAge;
      createdStudent.createdAt = new Date();
      jest.spyOn(studentRepository, 'save').mockResolvedValue(createdStudent);

      const result = await service.create(studentInput);
      expect(studentRepository.create).toHaveBeenCalledWith(studentInput);
      expect(studentRepository.save).toHaveBeenCalledWith(createdStudent);
      expect(result).toEqual(createdStudent);
    });
    it('should throw an error when student creation fails', async () => {
      jest.spyOn(studentRepository, 'create').mockReturnValue({
        ...studentInput,
        age: 29,
        id: 1,
        createdAt: undefined,
      });
      jest
        .spyOn(studentRepository, 'save')
        .mockRejectedValue(
          new Error('Unable to create student. Please try again later.'),
        );

      // Ensure the method throws the expected error
      await expect(service.create(studentInput)).rejects.toThrowError(
        'Unable to create student. Please try again later.',
      );
    });
  });
  describe('Update Student', () => {
    it('Should update a student', async () => {
      const existingStudent: Student = {
        id: 1,
        age: 29,
        name: 'Saman',
        email: 'saman@gmail.com',
        gender: 'male',
        address: 'No. 53, Galle Road, Dehiwala',
        mobileNo: '0715586362',
        dob: new Date('1996@we'),
        createdAt: new Date(),
      };
      const updateStudentInput: CreateStudentInput = {
        name: 'saman',
        email: 'saman@gmail.com',
        gender: 'male',
        address: 'No. 53, Galle Road, Dehiwala',
        mobileNo: '0715586362',
        dob: new Date('1996-02-25'),
      };

      jest
        .spyOn(studentRepository, 'findOne')
        .mockResolvedValue(existingStudent);
      const updateStudent: Student = {
        ...existingStudent,
        ...updateStudentInput,
      };
      const age =
        new Date().getFullYear() -
        new Date(updateStudentInput.dob).getFullYear();
      updateStudent.age = age;
      updateStudent.updatedAt = new Date();
      jest.spyOn(studentRepository, 'save').mockResolvedValue(updateStudent);
      const result = await service.update(1, updateStudent);
      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(studentRepository.save).toHaveBeenCalledWith(updateStudent);

      expect(result).toEqual(updateStudent);
    });
  });
  describe('Delete Student', () => {
    it('should delete a student and return the deleted student', async () => {
      const student: Student = {
        id: 1,
        name: 'Saman',
        email: 'saman@gmail.com',
        gender: 'male',
        address: 'No. 53, Galle Road, Dehiwala',
        mobileNo: '0715586362',
        dob: new Date('1996-02-25'),
        age: 28,
        createdAt: new Date(),
      };

      jest.spyOn(studentRepository, 'findOne').mockResolvedValue(student);
      jest
        .spyOn(studentRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.remove(1);

      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(studentRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(student);
    });
  });
  describe('Fetch All Students', () => {
    it('should return all students', async () => {
      const studentArray: Student[] = [
        {
          id: 1,
          age: 29,
          name: 'saman',
          email: 'saman@gmail.com',
          gender: 'male',
          address: 'No. 53, Galle Road, Dehiwala',
          mobileNo: '0715586362',
          dob: new Date('1996-02-25'),
          createdAt: new Date(),
        },
        {
          id: 2,
          age: 26,
          name: 'kamala',
          email: 'kamala@gmail.com',
          gender: 'female',
          address: 'No. 53, Galle Road, Pettah',
          mobileNo: '0785693258',
          dob: new Date('1999-02-25'),
          createdAt: new Date(),
        },
      ];

      jest.spyOn(studentRepository, 'find').mockResolvedValue(studentArray);

      const result = await service.findAll();

      expect(studentRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(studentArray);
    });
  });
  describe('Find one Students', () => {
    it('Should Retrieve Student by ID', async () => {
      const studentData: Student = {
        id: 1,
        age: 29,
        name: 'saman',
        email: 'saman@gmail.com',
        gender: 'male',
        address: 'No. 53, Galle Road, Dehiwala',
        mobileNo: '0715586362',
        dob: new Date('1996-02-25'),
        createdAt: new Date(),
      };
      jest.spyOn(studentRepository, 'findOne').mockResolvedValue(studentData);
      const result = await service.findOne(1);
      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(studentData);
    });
  });
  describe('Retrieve Paginated Students', () => {
    it('Should Retrieve Paginated students', async () => {
      const paginatedQuery: FetchPaginatedStudentsInput = {
        skip: 1,
        pageSize: 10,
        name: 'saman',
        email: 'saman@gmail.com',
        address: 'No. 53, Galle Road, Dehiwala',
      };
      const student: Student = {
        id: 1,
        age: 29,
        name: 'saman',
        email: 'saman@gmail.com',
        gender: 'male',
        address: 'No. 53, Galle Road, Dehiwala',
        mobileNo: '0715586362',
        dob: new Date('1996-02-25'),
        createdAt: new Date(),
      };
      const expectedOutput: FetchPaginatedStudentsOutput = {
        current: 1,
        pageSize: 10,
        totalPages: 1,
        totalSize: 1,
        data: [student],
      };
      jest
        .spyOn(studentRepository, 'findAndCount')
        .mockResolvedValue([[student], 1]);
      const result = await service.fetchPaginatedStudents(paginatedQuery);
      expect(studentRepository.findAndCount).toHaveBeenCalledWith({
        skip: paginatedQuery.skip > 0 ? paginatedQuery.skip : 0,
        take: paginatedQuery.pageSize,
        order: { createdAt: 'DESC' },
      });

      expect(result).toEqual(expectedOutput);
    });
  });
});
