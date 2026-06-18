import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import KanbanBoard from '../../components/KanbanBoard';

const { mockSocket, listeners } = vi.hoisted(() => {
  const listeners = {};
  const mockSocket = {
    on: vi.fn((event, cb) => { listeners[event] = cb; }),
    off: vi.fn((event) => { delete listeners[event]; }),
    emit: vi.fn(),
    connected: true,
    removeAllListeners: vi.fn(() => {
      for (let key in listeners) delete listeners[key];
    })
  };
  return { mockSocket, listeners };
});

vi.mock('../../services/socket', () => ({
  default: mockSocket
}));

// Mock recharts because ResizeObserver is not available in JSDOM easily
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: () => <div data-testid="mock-barchart" />,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Cell: () => null,
}));

// Mock the react-select component which is complex for JSDOM
vi.mock('react-select', () => ({
  default: ({ options, value, onChange }) => (
    <select data-testid="mock-select" value={value?.value} onChange={e => onChange(options.find(o => o.value === e.target.value))}>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  )
}));

describe('KanbanBoard Integration', () => {
  beforeEach(() => {
    mockSocket.removeAllListeners();
  });

  it('renders columns and connects to socket', () => {
    render(<KanbanBoard />);
    
    expect(screen.getByText('Real-Time Kanban')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('receives initial tasks via sync:tasks event', () => {
    render(<KanbanBoard />);
    
    const initialTasks = [
      { id: '1', title: 'Socket Task 1', status: 'To Do', priority: 'Low', category: 'Feature' }
    ];

    act(() => {
      // Simulate server sending initial tasks
      if (listeners['sync:tasks']) {
        listeners['sync:tasks'](initialTasks);
      }
    });

    expect(screen.getByText('Socket Task 1')).toBeInTheDocument();
  });

  it('adds a new task when task:create event is received', () => {
    render(<KanbanBoard />);
    
    act(() => {
      if (listeners['task:create']) {
        listeners['task:create']({ 
          id: '2', 
          title: 'New Incoming Task', 
          status: 'In Progress', 
          priority: 'High', 
          category: 'Bug' 
        });
      }
    });

    expect(screen.getByText('New Incoming Task')).toBeInTheDocument();
  });
});
