export interface CreateBulkStudentInput {
  students: StudentInput[];
}

export interface StudentInput {
  name: string;
  age: number;
  email: string;
  gender: string;
  address: string;
  mobileNo: string;
  dob: Date;
}
