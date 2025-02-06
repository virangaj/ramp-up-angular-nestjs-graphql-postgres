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
  DELETE_STUDENT,
  FETCH_PAGINATED_STUDENTS,
  UPDATE_STUDENT,
} from '../query/students.gql';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private grapghqlService: GraphqlService) {}
  //  fetch paginated students
  async fetchPaginatedStudents(
    inputData: FetchPaginatedStudentsInput
  ): Promise<FetchPaginatedStudentsOutput> {
    let paginatedStudents: FetchPaginatedStudentsOutput;
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
        //  return the final result
        paginatedStudents = res.data['fetchPaginatedStudents'];
        return paginatedStudents;
      })
      .catch((err) => {
        console.error(err);
        throw new Error('Failed to fetch students: ' + err.message);
      });
  }
  //  create new student
  async createNewStudent(student: CreateStudent): Promise<Student> {
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
        throw new Error('Failed to create student: ' + err.message);
      });
  }

  //  update student
  async updateStudent(id: number, student: CreateStudent): Promise<Student> {
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
        throw new Error('Failed to update student: ' + err.message);
      });
  }
  //  remove student
  async removeStudent(id: number): Promise<Student> {
    return this.grapghqlService
      .mutateQuery({
        mutation: DELETE_STUDENT,
        variables: {
          id: id,
        },
      })
      .then((res: any) => {
        return res.data['removeStudent'];
      })
      .catch((err) => {
        console.error(err);
        throw new Error('Failed to delete student: ' + err.message);
      });
  }
}
