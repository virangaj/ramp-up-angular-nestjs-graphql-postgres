import gql from 'graphql-tag';

export const GET_ALL_STUDENT = gql`
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