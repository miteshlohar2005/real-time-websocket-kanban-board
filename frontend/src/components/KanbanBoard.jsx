import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';

import socket from '../services/socket';
import Column from './Column';
import TaskModal from './TaskModal';
import ProgressChart from './ProgressChart';
import TaskCard from './TaskCard';

const COLUMNS = ['To Do', 'In Progress', 'Done'];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [isConnected, setIsConnected] = useState(false); const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // For drag overlay
  const [activeTask, setActiveTask] = useState(null);

  // Setup DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    setIsConnected(socket.connected);

    function onConnect() {
      console.log("CONNECTED");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("DISCONNECTED");
      setIsConnected(false);
    }

    function onSyncTasks(serverTasks) {
      setTasks(serverTasks);
    }

    function onTaskCreate(newTask) {
      setTasks(prev => [...prev, newTask]);
    }

    function onTaskUpdate(updatedTask) {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    }

    function onTaskMove({ id, status }) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    }

    function onTaskDelete(taskId) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('sync:tasks', onSyncTasks);
    socket.on('task:create', onTaskCreate);
    socket.on('task:update', onTaskUpdate);
    socket.on('task:move', onTaskMove);
    socket.on('task:delete', onTaskDelete);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('sync:tasks', onSyncTasks);
      socket.off('task:create', onTaskCreate);
      socket.off('task:update', onTaskUpdate);
      socket.off('task:move', onTaskMove);
      socket.off('task:delete', onTaskDelete);
    };
  }, []);

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const overId = over.id;

    const activeTask = tasks.find(t => t.id === taskId);
    let newStatus = activeTask.status;

    // Check if dropped over a column
    if (COLUMNS.includes(overId)) {
      newStatus = overId;
    } else {
      // Check if dropped over another task
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (activeTask.status !== newStatus) {
      // Optimistic UI update
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

      // Send to server
      socket.emit('task:move', { id: taskId, status: newStatus });
    }
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      socket.emit('task:update', taskData);
    } else {
      socket.emit('task:create', taskData);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      socket.emit('task:delete', taskId);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
  };

  return (
    <>
      <div className="header">
        <div>
          <h1>Real-Time Kanban</h1>
          <div style={{ fontSize: '0.85rem', color: isConnected ? '#10b981' : '#ef4444', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: isConnected ? '#10b981' : '#ef4444' }} />
            {isConnected ? 'Connected via WebSocket' : 'Reconnecting...'}
          </div>
        </div>
        <button className="btn" onClick={openCreateModal}>
          <Plus size={18} /> New Task
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          {COLUMNS.map(colId => (
            <Column
              key={colId}
              id={colId}
              title={colId}
              tasks={tasks.filter(t => t.status === colId)}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? <TaskCard task={activeTask} onEdit={() => { }} onDelete={() => { }} /> : null}
        </DragOverlay>
      </DndContext>

      <ProgressChart tasks={tasks} />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        existingTask={editingTask}
      />
    </>
  );
}
