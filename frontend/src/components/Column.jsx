import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

export default function Column({ id, title, tasks, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: 'Column', status: id }
  });

  return (
    <div 
      className={`glass-panel column col-${id.replace(' ', '').toLowerCase()}`}
      style={{ background: isOver ? 'rgba(51, 65, 85, 0.8)' : undefined }}
    >
      <div className="column-header">
        {title}
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <div ref={setNodeRef} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '150px' }}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
