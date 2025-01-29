import { Injectable } from '@angular/core';
import { StudentService } from '../services/student.service';
import {
  FetchPaginatedStudentsInput,
  FetchPaginatedStudentsOutput,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class StudentFacade {
  constructor(private studentServie: StudentService) {}

  getPaginatedStudents(
    inputData: FetchPaginatedStudentsInput
  ): Promise<FetchPaginatedStudentsOutput> {
    return this.studentServie.fetchPaginatedStudents(inputData);
  }
}
