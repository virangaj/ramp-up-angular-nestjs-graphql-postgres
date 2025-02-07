import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateStudentInput } from './dto/create-student.input';
import { FetchPaginatedStudentsInput } from './dto/fetch-paginated-students-input';
import { FetchPaginatedStudentsOutput } from './dto/fetch-paginated-students-output';
import { Student } from './entities/student.entity';
import { StudentService } from './student.service';
import { BadRequestException } from '@nestjs/common';

describe('StudentService', () => {
  let service: StudentService;
  let studentRepository: Repository<Student>;
  let dataSource: DataSource;
  const studentInput: CreateStudentInput = {
    name: 'saman',
    email: 'saman@gmail.com',
    gender: 'male',
    address: 'No. 53, Galle Road, Dehiwala',
    mobileNo: '0715586362',
    courseId: 1,
    dob: new Date('1996-02-25'),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(),
          },
        },
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
    dataSource = module.get<DataSource>(DataSource);
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
        courseId: 1,
        course: undefined,
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
    // it('Should throw error when invalid birthdate', async () => {
    //   const futureDate = new Date();
    //   futureDate.setFullYear(futureDate.getFullYear() + 1);
    //   const studentData: CreateStudentInput = {
    //     name: 'saman',
    //     email: 'saman@gmail.com',
    //     gender: 'male',
    //     address: 'No. 53, Galle Road, Dehiwala',
    //     mobileNo: '0715586362',
    //     courseId: 1,
    //     dob: futureDate,
    //   };
    //   await expect(service.create(studentData)).rejects.toThrow(
    //     BadRequestException,
    //   );
    // });
    it('should throw an error when student creation fails', async () => {
      jest.spyOn(studentRepository, 'create').mockReturnValue({
        ...studentInput,
        age: 29,
        id: 1,
        createdAt: undefined,
        courseId: 1,
        course: undefined,
      });
      jest
        .spyOn(studentRepository, 'save')
        .mockRejectedValue(
          new Error('Unable to create student. Please try again later.'),
        );
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
        dob: new Date('1996/02/15'),
        createdAt: new Date(),
        courseId: 1,
        course: undefined,
      };
      const updateStudentInput: CreateStudentInput = {
        name: 'saman',
        email: 'saman@gmail.com',
        gender: 'male',
        address: 'No. 53, Galle Road, Dehiwala',
        courseId: 1,
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
      expect(studentRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...updateStudent,
          updatedAt: expect.any(Date),
        }),
      );

      expect(result).toEqual(
        expect.objectContaining({
          ...updateStudent,
          updatedAt: expect.any(Date),
        }),
      );
    });
    it('Should throw error when invalid birthdate', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const studentData: CreateStudentInput = {
        name: 'saman',
        email: 'saman@gmail.com',
        gender: 'male',
        address: 'No. 53, Galle Road, Dehiwala',
        mobileNo: '0715586362',
        courseId: 1,
        dob: futureDate,
      };
      jest.spyOn(studentRepository, 'findOne').mockResolvedValue({
        id: 1,
        ...studentData,
      } as Student);

      await expect(service.update(1, studentData)).rejects.toThrow(
        'Invalid birthday.',
      );
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
        courseId: 1,
        course: undefined,
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
    it('should throw an error when student not found', async () => {
      jest.spyOn(studentRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(
        'Unable to delete students. Please try again later.',
      );

      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(studentRepository.delete).not.toHaveBeenCalled();
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
          courseId: 1,
          course: undefined,
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
          courseId: 1,
          course: undefined,
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
        courseId: 1,
        course: undefined,
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
        courseId: 1,
        course: undefined,
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
      });

      expect(result).toEqual(expectedOutput);
    });
  });
  describe('bulkCreate', () => {
    const mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    };
    it('should successfully create multiple students and commit transaction', async () => {
      const bulkInput = {
        bulkCreateStudents: [
          { ...studentInput, dob: new Date('1996-02-25') },
          { ...studentInput, dob: new Date('1998-03-15') },
        ],
      };
      const createdStudents: Student[] = bulkInput.bulkCreateStudents.map(
        (student, index) => ({
          name: student.name,
          email: student.email,
          gender: student.gender,
          address: student.address,
          mobileNo: student.mobileNo,
          courseId: student.courseId,
          dob: student.dob,
          id: index + 1,
          age: new Date().getFullYear() - new Date(student.dob).getFullYear(),
          createdAt: expect.any(Date),
          course: undefined,
        }),
      );

      jest
        .spyOn(dataSource, 'createQueryRunner')
        .mockReturnValue(mockQueryRunner as any);
      jest.spyOn(studentRepository, 'create').mockImplementation((student) => ({
        name: student.name,
        email: student.email,
        gender: student.gender,
        address: student.address,
        mobileNo: student.mobileNo,
        courseId: student.courseId,
        dob: student.dob as Date,
        id: student.id,
        age:
          new Date().getFullYear() -
          new Date(student.dob as Date).getFullYear(),
        createdAt: new Date(),
        course: undefined,
      }));
      jest
        .spyOn(studentRepository, 'save')
        .mockImplementation((students: any) =>
          Promise.resolve(Array.isArray(students) ? createdStudents : students),
        );

      const result = await service.bulkCreate(bulkInput);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(studentRepository.create).toHaveBeenCalledTimes(2);
      expect(studentRepository.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            age: expect.any(Number),
            createdAt: expect.any(Date),
          }),
        ]),
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(result).toEqual([...createdStudents]);
    });
    it('should rollback transaction and throw error on save failure', async () => {
      jest
        .spyOn(dataSource, 'createQueryRunner')
        .mockReturnValue(mockQueryRunner as any);
      jest
        .spyOn(studentRepository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.bulkCreate({
          bulkCreateStudents: [studentInput],
        }),
      ).rejects.toThrow('Unable to create students. Please try again later.');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
  describe('forCourse', () => {
    it('should return students for a specific course', async () => {
      const courseId = 1;
      const mockStudents = [
        {
          id: 1,
          name: 'saman',
          email: 'saman@gmail.com',
          gender: 'male',
          address: 'No. 53, Galle Road, Dehiwala',
          mobileNo: '0715586362',
          courseId: courseId,
          dob: new Date('1996-02-25'),
          age: 27,
          createdAt: new Date(),
          course: undefined,
        },
      ];
      jest.spyOn(studentRepository, 'find').mockResolvedValue(mockStudents);

      const result = await service.forCourse(courseId);

      expect(studentRepository.find).toHaveBeenCalledWith({
        where: { courseId: courseId },
      });

      expect(result).toEqual(mockStudents);
    });
    it('should return null when error occurs', async () => {
      const courseId = 1;
      jest
        .spyOn(studentRepository, 'find')
        .mockRejectedValue(new Error('Database error'));

      const result = await service.forCourse(courseId);

      expect(result).toBeNull();
    });
  });
});
