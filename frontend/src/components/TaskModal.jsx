import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const priorityOptions = [
  { value: 'Low', label: 'Low Priority' },
  { value: 'Medium', label: 'Medium Priority' },
  { value: 'High', label: 'High Priority' }
];

const categoryOptions = [
  { value: 'Bug', label: 'Bug' },
  { value: 'Feature', label: 'Feature' },
  { value: 'Enhancement', label: 'Enhancement' }
];

const customSelectStyles = {
  control: (base) => ({
    ...base,
    background: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#f8fafc'
  }),
  menu: (base) => ({
    ...base,
    background: '#1e293b',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  }),
  option: (base, { isFocused }) => ({
    ...base,
    background: isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    color: '#f8fafc'
  }),
  singleValue: (base) => ({
    ...base,
    color: '#f8fafc'
  }),
  input: (base) => ({
    ...base,
    color: '#f8fafc'
  })
};

export default function TaskModal({ isOpen, onClose, onSave, existingTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(priorityOptions[1]);
  const [category, setCategory] = useState(categoryOptions[1]);
  const [attachmentUrl, setAttachmentUrl] = useState(null);

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title || '');
      setDescription(existingTask.description || '');
      setPriority(priorityOptions.find(p => p.value === existingTask.priority) || priorityOptions[1]);
      setCategory(categoryOptions.find(c => c.value === existingTask.category) || categoryOptions[1]);
      setAttachmentUrl(existingTask.attachmentUrl || null);
    } else {
      setTitle('');
      setDescription('');
      setPriority(priorityOptions[1]);
      setCategory(categoryOptions[1]);
      setAttachmentUrl(null);
    }
  }, [existingTask, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create an object URL to preview the image without backend upload
      const url = URL.createObjectURL(file);
      setAttachmentUrl(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      description,
      priority: priority.value,
      category: category.value,
      attachmentUrl
    };

    if (existingTask) {
      onSave({ ...existingTask, ...taskData });
    } else {
      onSave({ ...taskData, status: 'To Do' }); // Default status for new
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
        <h2>{existingTask ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input 
              type="text" 
              className="form-control" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
              placeholder="E.g., Fix login bug"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-control" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={3} 
              placeholder="Add more details..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Priority</label>
              <Select 
                options={priorityOptions} 
                value={priority} 
                onChange={setPriority} 
                styles={customSelectStyles}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <Select 
                options={categoryOptions} 
                value={category} 
                onChange={setCategory} 
                styles={customSelectStyles}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Attachment (Image only for preview)</label>
            <input 
              type="file" 
              accept="image/*" 
              className="form-control" 
              onChange={handleFileChange} 
            />
            {attachmentUrl && (
              <img src={attachmentUrl} alt="Preview" className="img-preview" />
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn">
              {existingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
