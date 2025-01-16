import gql from 'graphql-tag';

export const GET_ALL_STUDENTS = gql`
  query GetAllStudent {
    getAllStudent {
      id
      name
      age
      email
      gender
      address
      mobileNo
      dob
    }
  }
`;

export const CREATE_STUDENT = gql`
  mutation CreateStudent($input: CreateStudentInput!) {
    createStudent(createStudentInput: $input) {
      id
      name
      age
      email
      gender
      address
      mobileNo
      dob
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: ID!, $input: UpdateStudentInput!) {
    updateStudent(id: $id, updateStudentInput: $input) {
      id
      name
      age
      email
      gender
      address
      mobileNo
      dob
    }
  }
`;
