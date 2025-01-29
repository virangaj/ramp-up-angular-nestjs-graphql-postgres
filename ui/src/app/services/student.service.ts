import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import {
  FetchPaginatedStudentsInput,
  FetchPaginatedStudentsOutput,
} from '../models';
import { FETCH_PAGINATED_STUDENTS } from '../query/students.gql';

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
}
