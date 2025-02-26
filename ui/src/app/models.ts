import { SortDescriptor } from '@progress/kendo-data-query';

export class CreateStudent {
  name: string;
  email: string;
  gender: string;
  address: string;
  mobileNo: string;
  dob: Date;
  courseId: number;
}
export class Student {
  id?: number;
  name: string;
  email: string;
  gender: string;
  address: string;
  mobileNo: string;
  dob: Date;
  age?: number;
  courseId: number;
}
export interface State {
  sort: SortDescriptor[];
  skip: number;
  take: number;
}
export interface CreateStudentResponse {
  createStudent: Student;
}
export interface UpdateStudentResponse {
  updateStudent: Student;
}

export interface FetchPaginatedStudentsInput {
  skip: number;
  pageSize: number;
  name?: string;
  email?: string;
  address?: string;
}

export interface FetchPaginatedStudentsOutput {
  current: number;
  pageSize: number;
  totalPages: number;
  totalSize: number;
  data: Student[];
}
