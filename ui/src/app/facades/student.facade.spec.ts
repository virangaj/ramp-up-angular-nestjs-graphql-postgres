import { TestBed } from '@angular/core/testing';

import { StudentFacade } from './student.facade';
import { Apollo } from 'apollo-angular';
import { StudentService } from '../services/student.service';
import {
  CreateStudent,
  FetchPaginatedStudentsInput,
  FetchPaginatedStudentsOutput,
  Student,
} from '../models';

describe('StudentFacade', () => {
  let facade: StudentFacade;
  let studentService: jasmine.SpyObj<StudentService>;
  const mockStudents: Student[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'Male',
      address: '123 Street, City',
      mobileNo: '1234567890',
      dob: new Date('2000-01-01'),
      age: 24,
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      gender: 'Female',
      address: '456 Avenue, City',
      mobileNo: '0987654321',
      dob: new Date('2002-05-15'),
      age: 22,
    },
  ];
  beforeEach(() => {
    const spy = jasmine.createSpyObj('StudentService', [
      'fetchPaginatedStudents',
      'createNewStudent',
      'updateStudent',
      'removeStudent',
    ]);
    TestBed.configureTestingModule({
      providers: [
        { provide: Apollo, useValue: {} },
        { provide: StudentService, useValue: spy },
      ],
    });
    facade = TestBed.inject(StudentFacade);
    studentService = TestBed.inject(
      StudentService
    ) as jasmine.SpyObj<StudentService>;
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
  it('Should get paginated studnets', async () => {
    const pagination: FetchPaginatedStudentsInput = {
      skip: 1,
      pageSize: 5,
    };
    const mockResponse: FetchPaginatedStudentsOutput = {
      current: 1,
      pageSize: 5,
      totalPages: 1,
      totalSize: 1,
      data: [...mockStudents],
    };
    studentService.fetchPaginatedStudents.and.returnValue(
      Promise.resolve(mockResponse)
    );
    const result = await facade.getPaginatedStudents(pagination);

    expect(result).toEqual(mockResponse);
    expect(studentService.fetchPaginatedStudents).toHaveBeenCalledWith(
      pagination
    );
  });
  it('Should create new student', async () => {
    const createStudent: CreateStudent = {
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'Male',
      address: '123 Street, City',
      mobileNo: '1234567890',
      dob: new Date('2000-01-01'),
    };
    const mockResponse: Student = mockStudents[0];
    studentService.createNewStudent.and.returnValue(
      Promise.resolve(mockResponse)
    );
    const result = await facade.createNewStudent(createStudent);

    expect(result).toEqual(mockResponse);
    expect(studentService.createNewStudent).toHaveBeenCalledWith(createStudent);
  });
  it('Should update student', async () => {
    const updateStudent: CreateStudent = {
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'Male',
      address: '123 Street, City',
      mobileNo: '1234567890',
      dob: new Date('2000-01-01'),
    };
    const mockResponse: Student = mockStudents[0];
    studentService.updateStudent.and.returnValue(Promise.resolve(mockResponse));
    const result = await facade.updateStudent(1, updateStudent);

    expect(result).toEqual(mockResponse);
    expect(studentService.updateStudent).toHaveBeenCalledWith(1, updateStudent);
  });
  it('Should delete student', async () => {
    const mockResponse: Student = mockStudents[0];
    studentService.removeStudent.and.returnValue(Promise.resolve(mockResponse));
    const result = await facade.removeStudent(1);

    expect(result).toEqual(mockResponse);
    expect(studentService.removeStudent).toHaveBeenCalledWith(1);
  });
});
