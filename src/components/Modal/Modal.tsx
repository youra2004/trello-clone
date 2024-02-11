import { ChangeEvent, useState } from 'react';
import ModalComponent from 'react-modal';
import {
  ApolloClient,
  NormalizedCacheObject,
  useMutation,
} from '@apollo/client';

import styles from './Modal.module.scss';
import { CREATE_TASK } from '../../apollo/mutations';
import { GET_TASKS } from '../../apollo/queries';

interface PropsI {
  isOpen: boolean;
  closeModal: () => void;
  type: string;
  client: ApolloClient<NormalizedCacheObject>;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: 0,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
};

interface TaskInfo {
  title: string;
  description: string;
}

export const Modal = ({ isOpen, closeModal, type, client }: PropsI) => {
  const [taskInfo, setTaskInfo] = useState<TaskInfo>({
    title: '',
    description: '',
  });

  const [createTask] = useMutation(CREATE_TASK);

  const changeTaskInfoHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTaskInfo((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const createTaskHandler = () => {
    const newTask = {
      id: new Date().getSeconds(),
      data: { ...taskInfo, type, assignee: null, author: null, comments: null },
    };

    const { tasks } = client.readQuery({ query: GET_TASKS });

    client.writeQuery({
      query: GET_TASKS,
      data: {
        tasks: [...tasks, newTask],
      },
    });

    createTask({ variables: { payload: newTask.data } });

    closeModal();
  };

  return (
    <ModalComponent
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Create Task</h2>
          <span>
            for list <strong>{type}</strong>
          </span>
        </div>

        <div className={styles.container}>
          <input
            name='title'
            placeholder='Task title'
            className={styles.input}
            onChange={changeTaskInfoHandler}
            value={taskInfo.title}
          />

          <input
            name='description'
            placeholder='Task description'
            className={styles.input}
            onChange={changeTaskInfoHandler}
            value={taskInfo.description}
          />
        </div>

        <div className={styles.buttons}>
          <button onClick={createTaskHandler} className={styles.button}>
            Create
          </button>
          <button onClick={closeModal} className={styles.button}>
            Cancel
          </button>
        </div>
      </div>
    </ModalComponent>
  );
};
