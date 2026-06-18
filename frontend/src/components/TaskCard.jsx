import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, Paperclip } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <div className="task-actions">
        <button 
          className="action-btn" 
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking
          onClick={() => onEdit(task)}
          aria-label="Edit Task"
        >
          <Edit2 size={16} />
        </button>
        <button 
          className="action-btn" 
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={() => onDelete(task.id)}
          aria-label="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="task-title">{task.title}</div>
      {task.description && <div className="task-desc">{task.description}</div>}

      {task.attachmentUrl && (
        <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8' }}>
          <Paperclip size={12} /> Attachment included
        </div>
      )}

      <div className="task-meta">
        <span className={`badge priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        <span className="badge category-badge">
          {task.category}
        </span>
      </div>
    </div>
  );
}
