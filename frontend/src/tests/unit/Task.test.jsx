import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '../../components/TaskCard';

// Mock the dnd-kit hooks to allow rendering
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

describe('TaskCard Component', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'To Do',
    priority: 'High',
    category: 'Bug',
    attachmentUrl: null,
  };

  it('renders task details correctly', () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Bug')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEditMock = vi.fn();
    render(<TaskCard task={mockTask} onEdit={onEditMock} onDelete={vi.fn()} />);
    
    const editBtn = screen.getByLabelText('Edit Task');
    fireEvent.click(editBtn);
    
    expect(onEditMock).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDeleteMock = vi.fn();
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={onDeleteMock} />);
    
    const deleteBtn = screen.getByLabelText('Delete Task');
    fireEvent.click(deleteBtn);
    
    expect(onDeleteMock).toHaveBeenCalledWith(mockTask.id);
  });
});
