import { ChangeEvent, useEffect, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import {
  DndContext,
  DragMoveEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import './App.scss';
import { GET_TASKS } from './apollo/queries';
import { MOVE_TASK } from './apollo/mutations';
import { TaskI } from './types';
import client from './apollo';
import { Column } from './components';
import { Circles } from 'react-loader-spinner';

const types: ['to-do', 'in-progress', 'done'] = [
  'to-do',
  'in-progress',
  'done',
];

function App() {
  const [activeTaskId, setActiveTaskId] = useState<UniqueIdentifier>('');
  const [activeTaskType, setActiveTaskType] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [sortedTasks, setSortedTasks] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data, loading } = useQuery(GET_TASKS);
  const [moveTask] = useMutation(MOVE_TASK);

  const handleDragStart = (e: DragMoveEvent) => {
    const { active: { id } } = e
    setActiveTaskId(id)
  }

  const handleMove = async (e: DragMoveEvent) => {
    const { active, over } = e;

    if (active?.id !== over?.id) {
      const overContainerType = data.tasks.find((task: TaskI) => task.id === over?.id)?.data?.type ?? over?.id

      setActiveTaskType(overContainerType)

      client.writeQuery({
        query: GET_TASKS,
        data: {
          tasks: data.tasks.map((task: TaskI) =>
            task.id === active.id
              ? { ...task, data: { ...task.data, type: overContainerType } }
              : task
          ),
        },
      });
    }
  };

  const handleDragEnd = async () => {
    if (activeTaskId && activeTaskType) {
      moveTask({ variables: { _id: activeTaskId, type: activeTaskType } })
      setActiveTaskId('');
      setActiveTaskType('')
    }
  };

  const changeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSortedTasks(data.tasks.filter((task: TaskI) => task.data.title.toLocaleLowerCase().trim().includes(searchValue.toLocaleLowerCase().trim())))
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [searchValue])

  if (loading) {
    return <Circles
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="circles-loading"
      wrapperClass="loader"
      visible={true}
    />;
  }

  return (
    <div>
      <input placeholder='Search' name='search' onChange={changeSearchValue} value={searchValue} className='input' />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragMove={handleMove}
        onDragEnd={handleDragEnd}
      >
        <div className='container'>
          <SortableContext
            items={types.map((type) => type)}
            strategy={verticalListSortingStrategy}
          >
            {types.map((item) => (
              <Column tasks={searchValue ? sortedTasks : data.tasks} type={item} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default App;
