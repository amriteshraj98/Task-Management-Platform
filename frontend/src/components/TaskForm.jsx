import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { FaTimes } from 'react-icons/fa';

const TaskForm = ({ taskToEdit, onClose, onTaskSaved }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
        tags: '',
        assigned_to: ''
    });

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                title: taskToEdit.title,
                description: taskToEdit.description || '',
                status: taskToEdit.status,
                priority: taskToEdit.priority,
                due_date: taskToEdit.due_date ? taskToEdit.due_date.split('T')[0] : '', // Format for input date
                tags: taskToEdit.tags ? taskToEdit.tags.join(', ') : '',
                assigned_to: taskToEdit.assigned_to ? taskToEdit.assigned_to.join(', ') : ''
            });
        }
    }, [taskToEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const dataToSend = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
            assigned_to: formData.assigned_to.split(',').map(user => user.trim()).filter(user => user !== '')
        };

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            if (taskToEdit) {
                await axios.put(`${API_URL}/tasks/${taskToEdit._id}`, dataToSend, config);
            } else {
                await axios.post(`${API_URL}/tasks`, dataToSend, config);
            }
            onTaskSaved();
        } catch (error) {
            console.error('Error saving task', error);
            alert('Failed to save task');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl">{taskToEdit ? 'Edit Task' : 'New Task'}</h2>
                    <button onClick={onClose}><FaTimes /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Title</label>
                        <input className="input" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Description</label>
                        <textarea className="input" name="description" value={formData.description} onChange={handleChange} rows="3" />
                    </div>
                    <div className="flex gap-4">
                        <div className="w-full">
                            <label className="block text-sm font-bold mb-1">Status</label>
                            <select className="input" name="status" value={formData.status} onChange={handleChange}>
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-bold mb-1">Priority</label>
                            <select className="input" name="priority" value={formData.priority} onChange={handleChange}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-full">
                            <label className="block text-sm font-bold mb-1">Due Date</label>
                            <input type="date" className="input" name="due_date" value={formData.due_date} onChange={handleChange} />
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-bold mb-1">Assign To</label>
                            <input className="input" name="assigned_to" value={formData.assigned_to} onChange={handleChange} placeholder="user1, user2, user3" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Tags (comma separated)</label>
                        <input className="input" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. design, urgent" />
                    </div>
                    <div className="flex gap-2 justify-end mt-4">
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">{taskToEdit ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
