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
  // fetch paginated student
  getPaginatedStudents(
    inputData: FetchPaginatedStudentsInput
  ): Promise<FetchPaginatedStudentsOutput> {
    return this.studentServie.fetchPaginatedStudents(inputData);
  }
  //  create new student
  async createNewStudent(student: CreateStudent): Promise<Student> {
    return this.studentServie.createNewStudent(student);
  }
  //  update student
  async updateStudent(id: number, student: CreateStudent): Promise<Student> {
    return this.studentServie.updateStudent(id, student);
  }
  // remove student
  async removeStudent(id: number): Promise<Student> {
    return this.studentServie.removeStudent(id);
  }
}
