import { useState } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import styles from './Column.module.scss';
import { TaskI } from '../../types';
import { Modal, SortableItem } from '..';
import { PlusIcon } from '../../icons';
import client from '../../apollo';

interface Props {
  tasks: TaskI[];
  type: 'to-do' | 'in-progress' | 'done';
}

export const Column = ({ tasks, type }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { setNodeRef, transform, transition } = useSortable({
    id: type,
    data: { type: 'container' },
  });

  const sortedTasks = tasks.filter(({ data }) => data.type === type);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  const openHandler = () => {
    setIsOpen(true);
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.column}>
      <SortableContext items={sortedTasks.map((data) => data.id)}>
        <h2 className={styles.header}>{type}</h2>

        <div className={styles.container}>
          {sortedTasks.map((data) => (
            <SortableItem key={data.id} data={data} />
          ))}
        </div>

        <div className={styles.addBlock} onClick={openHandler}>
          <PlusIcon />
          <span>Add a card</span>
        </div>
      </SortableContext>

      <Modal isOpen={isOpen} closeModal={closeHandler} type={type} client={client} />
    </div>
  );
};
