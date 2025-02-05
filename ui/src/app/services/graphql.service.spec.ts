import { TestBed } from '@angular/core/testing';

import { GraphqlService } from './graphql.service';
import { Apollo } from 'apollo-angular';
import { of, take } from 'rxjs';
import { CreateStudent, Student } from '../models';
import { CREATE_STUDENT, GET_ALL_STUDENTS } from '../query/students.gql';
import { ApolloQueryResult } from '@apollo/client/core';

describe('GraphqlService', () => {
  let service: GraphqlService;
  let apolloSpy: jasmine.SpyObj<Apollo>;
  beforeEach(() => {
    const spy = jasmine.createSpyObj('Apollo', ['watchQuery', 'mutate']);
    TestBed.configureTestingModule({
      providers: [{ provide: Apollo, useValue: spy }],
    });
    service = TestBed.inject(GraphqlService);
    apolloSpy = TestBed.inject(Apollo) as jasmine.SpyObj<Apollo>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should execute query', async () => {
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
    const mockResponse: ApolloQueryResult<{ getAllStudent: Student[] }> = {
      data: { getAllStudent: mockStudents },
      loading: false,
      networkStatus: 7,
      errors: undefined,
    };
    apolloSpy.watchQuery.and.returnValue({
      valueChanges: of(mockResponse).pipe(take(1)),
    } as any);
    const result = await service.executeQuery({ query: GET_ALL_STUDENTS });
    expect(result).toEqual(mockResponse);
    expect(apolloSpy.watchQuery).toHaveBeenCalledWith({
      query: GET_ALL_STUDENTS,
    });
  });
  it('Should excute mutate query', async () => {
    const mockStudent: Student = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'Male',
      address: '123 Street, City',
      mobileNo: '1234567890',
      dob: new Date('2000-01-01'),
      age: 24,
    };
    const mockCreateStudent: CreateStudent[] = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'Male',
        address: '123 Street, City',
        mobileNo: '1234567890',
        dob: new Date('2000-01-01'),
      },
    ];
    const mockResponse: ApolloQueryResult<{ createStudent: Student }> = {
      data: { createStudent: mockStudent },
      loading: false,
      networkStatus: 7,
      errors: undefined,
    };
    apolloSpy.mutate.and.returnValue(of(mockResponse));
    const result = await service.mutateQuery({
      mutation: CREATE_STUDENT,
      variables: {
        input: mockCreateStudent,
      },
    });
    expect(result).toEqual(mockResponse);
    expect(apolloSpy.mutate).toHaveBeenCalledWith({
      mutation: CREATE_STUDENT,
      variables: {
        input: mockCreateStudent,
      },
    });
  });
});
