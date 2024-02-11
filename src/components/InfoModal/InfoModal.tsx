import Modal from 'react-modal';

import { TaskI } from '../../types';
import styles from "./InfoModal.module.scss";

interface PropsI {
  isOpen: boolean;
  closeModal: () => void;
  task: TaskI;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
};

export const InfoModal = ({ isOpen, closeModal, task }: PropsI) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <div className={styles.details}>
        <div className={styles.header}>
          <h2 className={styles.title}>{task.data.title}</h2>
          <span className={styles.subtitle}>in list <strong>{task.data.type}</strong></span>
        </div>

        <div className={styles.content}>
          <h3>Description</h3>
          <span className={styles.description}>{task.data.description}</span>
        </div>
      </div>

      <button onClick={closeModal} className={styles.button}>Close</button>
    </Modal>
  );
};
