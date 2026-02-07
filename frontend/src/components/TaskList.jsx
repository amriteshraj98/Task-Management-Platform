import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import TaskItem from './TaskItem';
import { FaFilter, FaSearch } from 'react-icons/fa';

const TaskList = ({ refreshTrigger, onEditTask, triggerRefresh }) => {
    const { token } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 5,
                ...filters
            };
            const { data } = await axios.get(`${API_URL}/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setTasks(data.data);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching tasks', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [token, refreshTrigger, page, filters]); // Re-fetch on filter change or page change

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`${API_URL}/tasks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                triggerRefresh(); // specific refresh
                fetchTasks();
            } catch (error) {
                alert('Error deleting task');
            }
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setPage(1); // Reset to page 1 on filter
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaSearch className="text-text-light" />
                    </div>
                    <input 
                        className="input w-full" 
                        name="search" 
                        placeholder="Search tasks..." 
                        value={filters.search} 
                        onChange={handleFilterChange} 
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                       <select className="input" name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="">All Status</option>
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="relative">
                        <select className="input" name="priority" value={filters.priority} onChange={handleFilterChange}>
                            <option value="">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center p-8">Loading tasks...</div>
            ) : tasks.length === 0 ? (
                <div className="text-center p-8 bg-white border border-border rounded-lg">
                    <p className="text-text-light">No tasks found. Create one to get started!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {tasks.map(task => (
                        <TaskItem key={task._id} task={task} onEdit={onEditTask} onDelete={handleDelete} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button 
                        className="btn btn-secondary" 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </button>
                    <span className="flex items-center px-4">Page {page} of {totalPages}</span>
                    <button 
                        className="btn btn-secondary" 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskList;
