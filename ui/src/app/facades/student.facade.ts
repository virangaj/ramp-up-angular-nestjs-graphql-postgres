import { Injectable } from '@angular/core';
import { StudentService } from '../services/student.service';
import {
  CreateStudent,
  FetchPaginatedStudentsInput,
  FetchPaginatedStudentsOutput,
  Student,
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

  async createNewStudent(student: CreateStudent[]): Promise<Student> {
    return this.studentServie.createNewStudent(student);
  }
  async updateStudent(id: number, student: CreateStudent[]): Promise<Student> {
    return this.studentServie.updateStudent(id, student);
  }
}
