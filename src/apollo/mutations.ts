import { gql } from '@apollo/client';

export const MOVE_TASK = gql`
  mutation UpdateTask($_id: String!, $type: String!) {
    updateTask(_id: $_id, payload: { type: $type }) {
      data {
        type
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($payload: task_create_payload!) {
    createTask(payload: $payload) {
      data {
        title
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($ids: [String]!) {
    deleteTask(_ids: $ids) {
      response
    }
  }
`;
