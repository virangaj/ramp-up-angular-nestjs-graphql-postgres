import { TestBed } from '@angular/core/testing';
import { StudentService } from './student.service';
import { Apollo } from 'apollo-angular';
import { GraphqlService } from './graphql.service';
import {
  CreateStudent,
  FetchPaginatedStudentsInput,
  FetchPaginatedStudentsOutput,
  Student,
} from '../models';
import { ApolloQueryResult } from '@apollo/client/core';

describe('StudentService', () => {
  let service: StudentService;
  let graphqlService: jasmine.SpyObj<GraphqlService>;

  const mockStudents: Student[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'Male',
      address: '123 Street, City',
      mobileNo: '1234567890',
      dob: new Date('2000-01-01'),
      courseId: 1,
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
      courseId: 1,
      age: 22,
    },
  ];

  beforeEach(() => {
    const graphqlSpy = jasmine.createSpyObj('GraphqlService', [
      'executeQuery',
      'mutateQuery',
    ]);

    TestBed.configureTestingModule({
      providers: [
        StudentService,
        { provide: Apollo, useValue: {} },
        { provide: GraphqlService, useValue: graphqlSpy },
      ],
    });

    service = TestBed.inject(StudentService);
    graphqlService = TestBed.inject(
      GraphqlService
    ) as jasmine.SpyObj<GraphqlService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchPaginatedStudents', () => {
    let mockInput: FetchPaginatedStudentsInput;
    let mockResponse: ApolloQueryResult<{
      fetchPaginatedStudents: FetchPaginatedStudentsOutput;
    }>;

    beforeEach(() => {
      mockInput = {
        skip: 1,
        pageSize: 5,
      };

      const mockStudentResponse: FetchPaginatedStudentsOutput = {
        current: 1,
        pageSize: 5,
        totalPages: 1,
        totalSize: 2,
        data: [...mockStudents],
      };

      mockResponse = {
        data: { fetchPaginatedStudents: mockStudentResponse },
        loading: false,
        networkStatus: 7,
        errors: undefined,
      };
    });

    it('should fetch paginated students successfully', async () => {
      graphqlService.executeQuery.and.returnValue(
        Promise.resolve(mockResponse)
      );
      const result = await service.fetchPaginatedStudents(mockInput);
      expect(graphqlService.executeQuery).toHaveBeenCalledWith({
        query: jasmine.any(Object),
        variables: {
          page: {
            skip: mockInput.skip,
            pageSize: mockInput.pageSize,
          },
        },
      });
      expect(result).toEqual(mockResponse.data.fetchPaginatedStudents);
      expect(result.data).toEqual(mockStudents);
      expect(result.totalSize).toBe(2);
    });

    it('should handle errors when fetching students fails', async () => {
      const errorMessage = 'Failed to fetch students';
      graphqlService.executeQuery.and.returnValue(
        Promise.reject(new Error(errorMessage))
      );
      await expectAsync(
        service.fetchPaginatedStudents(mockInput)
      ).toBeRejectedWithError('Failed to fetch students: ' + errorMessage);
    });

    it('should handle empty response data', async () => {
      const emptyResponse = {
        data: {
          fetchPaginatedStudents: {
            current: 1,
            pageSize: 5,
            totalPages: 0,
            totalSize: 0,
            data: [],
          },
        },
        loading: false,
        networkStatus: 7,
        errors: undefined,
      };
      graphqlService.executeQuery.and.returnValue(
        Promise.resolve(emptyResponse)
      );
      const result = await service.fetchPaginatedStudents(mockInput);
      expect(result.data).toEqual([]);
      expect(result.totalSize).toBe(0);
    });

    it('should handle different page sizes', async () => {
      const largerPageInput: FetchPaginatedStudentsInput = {
        skip: 0,
        pageSize: 10,
      };
      graphqlService.executeQuery.and.returnValue(
        Promise.resolve(mockResponse)
      );
      await service.fetchPaginatedStudents(largerPageInput);
      expect(graphqlService.executeQuery).toHaveBeenCalledWith({
        query: jasmine.any(Object),
        variables: {
          page: {
            skip: 0,
            pageSize: 10,
          },
        },
      });
    });
  });
  describe('updateStudent', () => {
    const mockStudentId = 1;
    const mockUpdateInput: CreateStudent = {
      name: 'Updated John Doe',
      email: 'updated.john@example.com',
      gender: 'Male',
      address: 'Updated Street, City',
      courseId: 1,
      mobileNo: '9876543210',
      dob: new Date('2000-01-01'),
    };

    const mockUpdatedStudent: Student = {
      id: mockStudentId,
      ...mockUpdateInput,
    };

    const mockUpdateResponse = {
      data: {
        updateStudent: mockUpdatedStudent,
      },
    };

    it('should successfully update a student', async () => {
      graphqlService.mutateQuery.and.returnValue(
        Promise.resolve(mockUpdateResponse)
      );
      const result = await service.updateStudent(
        mockStudentId,
        mockUpdateInput
      );
      expect(graphqlService.mutateQuery).toHaveBeenCalledWith({
        mutation: jasmine.any(Object),
        variables: {
          id: mockStudentId,
          input: mockUpdateInput,
        },
      });
      expect(result).toEqual(mockUpdatedStudent);
    });

    it('should handle errors when updating student fails', async () => {
      const errorMessage = 'Network error';
      graphqlService.mutateQuery.and.returnValue(
        Promise.reject(new Error(errorMessage))
      );

      await expectAsync(
        service.updateStudent(mockStudentId, mockUpdateInput)
      ).toBeRejectedWithError('Failed to update student: ' + errorMessage);
    });

    it('should handle validation error from server', async () => {
      const validationError = new Error('Email is invalid');
      graphqlService.mutateQuery.and.returnValue(
        Promise.reject(validationError)
      );
      await expectAsync(
        service.updateStudent(mockStudentId, mockUpdateInput)
      ).toBeRejectedWithError('Failed to update student: Email is invalid');
    });

    it('should log error to console when update fails', async () => {
      const errorMessage = 'Update failed';
      graphqlService.mutateQuery.and.returnValue(
        Promise.reject(new Error(errorMessage))
      );
      spyOn(console, 'error');

      try {
        await service.updateStudent(mockStudentId, mockUpdateInput);
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });

    it('should handle invalid student ID', async () => {
      const invalidId = -1;
      const errorMessage = 'Invalid student ID';
      graphqlService.mutateQuery.and.returnValue(
        Promise.reject(new Error(errorMessage))
      );
      await expectAsync(
        service.updateStudent(invalidId, mockUpdateInput)
      ).toBeRejectedWithError('Failed to update student: ' + errorMessage);
    });

    it('should update student with minimal data', async () => {
      const minimalUpdate: CreateStudent = {
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'Male',
        dob: new Date('2000-01-01'),
        courseId: 1,
        address: '',
        mobileNo: '',
      };

      const minimalResponse = {
        data: {
          updateStudent: {
            id: mockStudentId,
            ...minimalUpdate,
          },
        },
      };

      graphqlService.mutateQuery.and.returnValue(
        Promise.resolve(minimalResponse)
      );

      const result = await service.updateStudent(mockStudentId, minimalUpdate);

      expect(result.id).toBe(mockStudentId);
      expect(result.name).toBe(minimalUpdate.name);
      expect(result.email).toBe(minimalUpdate.email);
    });
  });
  describe('createNewStudent', () => {
    const mockCreateInput: CreateStudent = {
      name: 'New Student',
      email: 'newstudent@example.com',
      gender: 'Male',
      address: '789 New Street, City',
      courseId: 1,
      mobileNo: '1122334455',
      dob: new Date('2000-01-01'),
    };

    const mockCreatedStudent: Student = {
      id: 3,
      ...mockCreateInput,
    };

    const mockCreateResponse = {
      data: {
        createStudent: mockCreatedStudent,
      },
    };

    it('should successfully create a new student', async () => {
      graphqlService.mutateQuery.and.returnValue(
        Promise.resolve(mockCreateResponse)
      );

      const result = await service.createNewStudent(mockCreateInput);

      expect(graphqlService.mutateQuery).toHaveBeenCalledWith({
        mutation: jasmine.any(Object),
        variables: {
          input: mockCreateInput,
        },
      });
      expect(result).toEqual(mockCreatedStudent);
      expect(result.id).toBeDefined();
      expect(result.name).toBe(mockCreateInput.name);
      expect(result.email).toBe(mockCreateInput.email);
    });

    it('should handle network errors during creation', async () => {
      const errorMessage = 'Network error';
      graphqlService.mutateQuery.and.returnValue(
        Promise.reject(new Error(errorMessage))
      );

      await expectAsync(
        service.createNewStudent(mockCreateInput)
      ).toBeRejectedWithError('Failed to create student: ' + errorMessage);
    });

    it('should handle validation errors from server', async () => {
      const validationError = new Error('Email already exists');
      graphqlService.mutateQuery.and.returnValue(
        Promise.reject(validationError)
      );
      await expectAsync(
        service.createNewStudent(mockCreateInput)
      ).toBeRejectedWithError('Failed to create student: Email already exists');
    });

    it('should log error to console when creation fails', async () => {
      const errorMessage = 'Creation failed';
      graphqlService.mutateQuery.and.returnValue(
        Promise.reject(new Error(errorMessage))
      );
      spyOn(console, 'error');

      try {
        await service.createNewStudent(mockCreateInput);
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });

    it('should create student with minimal required data', async () => {
      const minimalInput: CreateStudent = {
        name: 'Minimal Student',
        email: 'minimal@example.com',
        gender: 'Female',
        dob: new Date('2000-01-01'),
        address: '',
        courseId: 1,
        mobileNo: '',
      };

      const minimalResponse = {
        data: {
          createStudent: {
            id: 4,
            ...minimalInput,
          },
        },
      };

      graphqlService.mutateQuery.and.returnValue(
        Promise.resolve(minimalResponse)
      );
      const result = await service.createNewStudent(minimalInput);
      expect(result.id).toBeDefined();
      expect(result.name).toBe(minimalInput.name);
      expect(result.email).toBe(minimalInput.email);
      expect(result.address).toBe('');
      expect(result.mobileNo).toBe('');
    });

    it('should handle invalid date of birth', async () => {
      const invalidInput: CreateStudent = {
        ...mockCreateInput,
        dob: new Date('invalid date'),
      };
      await expectAsync(
        service.createNewStudent(invalidInput)
      ).toBeRejectedWithError();
    });
  });
  describe('removeStudent', () => {
    const mockStudentId = 1;
    const mockDeletedStudent: Student = {
      courseId: 1,
      id: mockStudentId,
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'Male',
      address: '123 Street, City',
      mobileNo: '1234567890',
      dob: new Date('2000-01-01'),
      age: 24,
    };

    const mockDeleteResponse = {
      data: {
        removeStudent: mockDeletedStudent,
      },
    };

    it('should successfully delete a student', async () => {
      graphqlService.mutateQuery.and.returnValue(
        Promise.resolve(mockDeleteResponse)
      );
      const result = await service.removeStudent(mockStudentId);
      expect(graphqlService.mutateQuery).toHaveBeenCalledWith({
        mutation: jasmine.any(Object),
        variables: {
          id: mockStudentId,
        },
      });
      expect(result).toEqual(mockDeletedStudent);
      expect(result.id).toBe(mockStudentId);
    });

    it('should handle network errors during deletion', async () => {
      const errorMessage = 'Network error';
      graphqlService.mutateQuery.and.returnValue(
        Promise.reject(new Error(errorMessage))
      );
      await expectAsync(
        service.removeStudent(mockStudentId)
      ).toBeRejectedWithError('Failed to delete student: ' + errorMessage);
    });

    it('should handle non-existent student ID', async () => {
      const nonExistentId = 999;
      const errorMessage = 'Student not found';
      graphqlService.mutateQuery.and.returnValue(
        Promise.reject(new Error(errorMessage))
      );
      await expectAsync(
        service.removeStudent(nonExistentId)
      ).toBeRejectedWithError('Failed to delete student: Student not found');
    });

    it('should log error to console when deletion fails', async () => {
      const errorMessage = 'Deletion failed';
      graphqlService.mutateQuery.and.returnValue(
        Promise.reject(new Error(errorMessage))
      );
      spyOn(console, 'error');
      try {
        await service.removeStudent(mockStudentId);
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });

    it('should handle invalid student ID format', async () => {
      const invalidId = -1;
      const errorMessage = 'Invalid student ID';
      graphqlService.mutateQuery.and.returnValue(
        Promise.reject(new Error(errorMessage))
      );
      await expectAsync(service.removeStudent(invalidId)).toBeRejectedWithError(
        'Failed to delete student: Invalid student ID'
      );
    });

    it('should return complete student data after deletion', async () => {
      graphqlService.mutateQuery.and.returnValue(
        Promise.resolve(mockDeleteResponse)
      );

      const result = await service.removeStudent(mockStudentId);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.gender).toBeDefined();
      expect(result.dob).toBeDefined();
      expect(result.age).toBeDefined();
    });

    it('should handle server errors during deletion', async () => {
      const serverError = new Error('Internal server error');
      graphqlService.mutateQuery.and.returnValue(Promise.reject(serverError));

      await expectAsync(
        service.removeStudent(mockStudentId)
      ).toBeRejectedWithError(
        'Failed to delete student: Internal server error'
      );
    });

    it('should handle deletion of already deleted student', async () => {
      const alreadyDeletedError = new Error('Student already deleted');
      graphqlService.mutateQuery.and.returnValue(
        Promise.reject(alreadyDeletedError)
      );
      await expectAsync(
        service.removeStudent(mockStudentId)
      ).toBeRejectedWithError(
        'Failed to delete student: Student already deleted'
      );
    });
  });
});
