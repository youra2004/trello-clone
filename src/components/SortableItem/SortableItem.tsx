import { MouseEvent, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation } from '@apollo/client';

import styles from './SortableItem.module.scss';
import { DeleteIcon } from '../../icons';
import { DELETE_TASK } from '../../apollo/mutations';
import client from '../../apollo';
import { GET_TASKS } from '../../apollo/queries';
import { TaskI } from '../../types';
import { InfoModal } from '..';

export const SortableItem = ({ data }: { data: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [deleteTask] = useMutation(DELETE_TASK);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: data.id,
    data: { type: 'item' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const deleteTaskHandler = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const { tasks } = client.readQuery({ query: GET_TASKS });

    client.writeQuery({ query: GET_TASKS, data: { tasks: tasks.filter((task: TaskI) => task.id !== data.id) } });

    deleteTask({ variables: { ids: [data.id] } });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div ref={setNodeRef} {...attributes} onClick={openModal} {...listeners} style={style} className={styles.task}>
        <span className={styles.title}>{data.data.title}</span>

        <div onClick={deleteTaskHandler}>
          <DeleteIcon />
        </div>
      </div>

      <InfoModal isOpen={isOpen} closeModal={closeModal} task={data} />
    </>
  );
};