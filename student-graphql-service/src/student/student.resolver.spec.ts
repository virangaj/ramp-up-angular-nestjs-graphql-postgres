import { Test, TestingModule } from '@nestjs/testing';
import { StudentResolver } from './student.resolver';
import { StudentService } from './student.service';
import { CreateStudentInput } from './dto/create-student.input';
import { Student } from './entities/student.entity';
import { CreateBulkStudentInput } from './dto/create-bulk-students.input';
import { FetchPaginatedStudentsInput } from './dto/fetch-paginated-students-input';
import { FetchPaginatedStudentsOutput } from './dto/fetch-paginated-students-output';

describe('StudentResolver', () => {
  let resolver: StudentResolver;
  let studentService: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentResolver,
        {
          provide: StudentService,
          useValue: {
            create: jest.fn(),
            bulkCreate: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            fetchPaginatedStudents: jest.fn(),
          },
        },
      ],
    }).compile();

    studentService = module.get<StudentService>(StudentService);
    resolver = module.get<StudentResolver>(StudentResolver);
  });

  describe('Create Student', () => {
    it('Should create a student', async () => {
      const studentInput: CreateStudentInput = {
        name: 'saman',
        email: 'saman@gmail.com',
        gender: 'male',
        address: 'No. 53, Galle Road, Dehiwala',
        mobileNo: '0715586362',
        dob: new Date('1996-02-25'),
      };

      const createdStudent: Student = {
        id: 1,
        age: 25,
        createdAt: new Date(),
        updatedAt: undefined,
        ...studentInput,
      };

      jest.spyOn(studentService, 'create').mockResolvedValue(createdStudent);

      const result = await resolver.createStudent(studentInput);

      expect(studentService.create).toHaveBeenCalledWith(studentInput);
      expect(result).toEqual(createdStudent);
    });
    it('Should handle error when student creation fails', async () => {
      const studentInput: CreateStudentInput = {
        name: 'saman',
        email: 'saman@gmail.com',
        gender: 'male',
        address: 'No. 53, Galle Road, Dehiwala',
        mobileNo: '0715586362',
        dob: new Date('1996@ew'),
      };
      jest
        .spyOn(studentService, 'create')
        .mockRejectedValue(
          new Error('Unable to create student. Please try again later.'),
        );
      await expect(resolver.createStudent(studentInput)).rejects.toThrow(
        'Unable to create student. Please try again later.',
      );
    });
  });

  describe('Create Bulk Students', () => {
    it('Should create multiple student', async () => {
      const studentArray: CreateStudentInput[] = [
        {
          name: 'saman',
          email: 'saman@gmail.com',
          gender: 'male',
          address: 'No. 53, Galle Road, Dehiwala',
          mobileNo: '0715586362',
          dob: new Date('1996-02-25'),
        },
        {
          name: 'kamala',
          email: 'kamala@gmail.com',
          gender: 'female',
          address: 'No. 53, Galle Road, Pettah',
          mobileNo: '0785693258',
          dob: new Date('1999-02-25'),
        },
      ];
      const studentInput: CreateBulkStudentInput = {
        bulkCreateStudents: studentArray,
      };
      const createdStudents: Student[] = [
        {
          id: 1,
          age: 29,
          createdAt: new Date(),
          ...studentArray[0],
        },
        {
          id: 2,
          age: 26,
          createdAt: new Date(),
          ...studentArray[1],
        },
      ];

      jest
        .spyOn(studentService, 'bulkCreate')
        .mockResolvedValue(createdStudents);

      const result = await resolver.bulkCreateStudents(studentInput);

      expect(studentService.bulkCreate).toHaveBeenCalledWith(studentInput);
      expect(result).toEqual(createdStudents);
    });
    it('Should handle error when student creation fails', async () => {
      const studentArray: CreateStudentInput[] = [
        {
          name: 'saman',
          email: 'saman@gmail.com',
          gender: 'male',
          address: 'No. 53, Galle Road, Dehiwala',
          mobileNo: '0715586362',
          dob: new Date('1996@wewe'),
        },
        {
          name: 'kamala',
          email: 'kamala@gmail.com',
          gender: 'female',
          address: 'No. 53, Galle Road, Pettah',
          mobileNo: '0785693258',
          dob: new Date('1999@wewe'),
        },
      ];
      const studentInput: CreateBulkStudentInput = {
        bulkCreateStudents: studentArray,
      };
      jest
        .spyOn(studentService, 'bulkCreate')
        .mockRejectedValue(
          new Error('Unable to create students. Please try again later.'),
        );

      await expect(resolver.bulkCreateStudents(studentInput)).rejects.toThrow(
        'Unable to create students. Please try again later.',
      );
    });
  });
  describe('Update Student', () => {
    it('Should update a student', async () => {
      const updateInput: CreateStudentInput = {
        name: 'saman',
        email: 'saman@gmail.com',
        gender: 'male',
        address: 'No. 53, Galle Road, Dehiwala',
        mobileNo: '0715586362',
        dob: new Date('1996-02-25'),
      };

      const createdStudent: Student = {
        id: 1,
        age: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...updateInput,
      };

      jest.spyOn(studentService, 'update').mockResolvedValue(createdStudent);

      const result = await resolver.updateStudent(updateInput, 1);
      expect(studentService.update).toHaveBeenCalledWith(1, updateInput);
      expect(result).toEqual(createdStudent);
    });
    it('Should handle error when student updates fails', async () => {
      const updateInput: CreateStudentInput = {
        name: 'saman',
        email: 'saman@gmail.com',
        gender: 'male',
        address: 'No. 53, Galle Road, Dehiwala',
        mobileNo: '0715586362',
        dob: new Date('1996@ew'),
      };
      jest
        .spyOn(studentService, 'update')
        .mockRejectedValue(
          new Error('Unable to update student. Please try again later.'),
        );
      await expect(resolver.updateStudent(updateInput, 1)).rejects.toThrow(
        'Unable to update student. Please try again later.',
      );
    });
  });
  describe('Delete Student', () => {
    it('Should delete a student', async () => {
      const studentToDelete = {
        id: 1,
        name: 'saman',
        email: 'saman@gmail.com',
        gender: 'male',
        address: 'No. 53, Galle Road, Dehiwala',
        mobileNo: '0715586362',
        age: 29,
        dob: new Date('1996-02-25'),
        createdAt: new Date(),
      };

      jest.spyOn(studentService, 'remove').mockResolvedValue(studentToDelete);

      const result = await resolver.removeStudent(1);

      expect(studentService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(studentToDelete);
    });
    it('Should handle error when student delete fails', async () => {
      jest
        .spyOn(studentService, 'remove')
        .mockRejectedValue(
          new Error('Unable to delete student. Please try again later.'),
        );
      await expect(resolver.removeStudent(1)).rejects.toThrow(
        'Unable to delete student. Please try again later.',
      );
    });
  });
  describe('Get All Students', () => {
    it('Should Retrieve all students', async () => {
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
      jest.spyOn(studentService, 'findAll').mockResolvedValue(studentArray);
      const result = await resolver.findAll();
      expect(studentService.findAll).toHaveBeenCalledWith();
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
      jest.spyOn(studentService, 'findOne').mockResolvedValue(studentData);
      const result = await resolver.findOne(1);
      expect(studentService.findOne).toHaveBeenCalledWith(1);
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
      const studentData: FetchPaginatedStudentsOutput = {
        current: 1,
        pageSize: 10,
        totalPages: 1,
        totalSize: 1,
        data: [
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
        ],
      };
      jest
        .spyOn(studentService, 'fetchPaginatedStudents')
        .mockResolvedValue(studentData);
      const result = await resolver.fetchPaginatedStudents(paginatedQuery);
      expect(studentService.fetchPaginatedStudents).toHaveBeenCalledWith(
        paginatedQuery,
      );
      expect(result).toEqual(studentData);
    });
  });
  describe('ResolveReference', () => {
    it('Should resolve a student by ID', async () => {
      const reference = {
        __typename: 'Student',
        id: 1,
      };
      const student: Student = {
        id: 1,
        name: 'saman',
        email: 'saman@gmail.com',
        gender: 'male',
        address: 'No. 53, Galle Road, Dehiwala',
        mobileNo: '0715586362',
        dob: new Date('1996-02-25'),
        age: 25,
        createdAt: new Date(),
      };
      jest.spyOn(studentService, 'findOne').mockResolvedValue(student);
      const result = await resolver.resolveReference(reference);
      expect(studentService.findOne).toHaveBeenCalledWith(reference.id);
      expect(result).toEqual(student);
    });

    it('Should throw an error if student is not found', async () => {
      const reference = {
        __typename: 'Student',
        id: 999, // Assuming ID doesn't exist
      };
      jest.spyOn(studentService, 'findOne').mockResolvedValue(null);
      const result = await resolver.resolveReference(reference);
      expect(result).toBeNull();
    });
  });
});
