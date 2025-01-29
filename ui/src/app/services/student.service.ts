import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import {
  CreateStudent,
  FetchPaginatedStudentsInput,
  FetchPaginatedStudentsOutput,
  Student,
} from '../models';
import {
  CREATE_STUDENT,
  FETCH_PAGINATED_STUDENTS,
  UPDATE_STUDENT,
} from '../query/students.gql';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private grapghqlService: GraphqlService) {}

  async fetchPaginatedStudents(
    inputData: FetchPaginatedStudentsInput
  ): Promise<FetchPaginatedStudentsOutput> {
    let paginatedStudents: FetchPaginatedStudentsInput;
    return this.grapghqlService
      .executeQuery({
        query: FETCH_PAGINATED_STUDENTS,
        variables: {
          page: {
            skip: Number(inputData.skip),
            pageSize: Number(inputData.pageSize),
          },
        },
      })
      .then((res: any) => {
        paginatedStudents = res.data['fetchPaginatedStudents'];
        return paginatedStudents;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  async createNewStudent(student: CreateStudent[]): Promise<Student> {
    return this.grapghqlService
      .mutateQuery({
        mutation: CREATE_STUDENT,
        variables: {
          input: student,
        },
      })
      .then((res: any) => {
        return res.data['createStudent'];
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  async updateStudent(id:number, student: CreateStudent[]): Promise<Student> {
    return this.grapghqlService
      .mutateQuery({
        mutation: UPDATE_STUDENT,
        variables: {
          id: id,
          input: student,
        },
      })
      .then((res: any) => {
        return res.data['updateStudent'];
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }
}
