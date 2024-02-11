import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query TaskQuery {
    tasks {
      id
      data {
        assignee
        author
        comments
        description
        title
        type
      }
    }
  }
`;
