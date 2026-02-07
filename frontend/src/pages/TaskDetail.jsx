import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import FileSection from '../components/FileSection';
import CommentSection from '../components/CommentSection';
import TaskForm from '../components/TaskForm';
import { FaArrowLeft, FaEdit, FaCalendar, FaFlag, FaTags } from 'react-icons/fa';
import { format } from 'date-fns';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);

    const fetchTask = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTask(data);
        } catch (error) {
            console.error('Error fetching task', error);
            navigate('/'); // Redirect if not found
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTask();
    }, [id, token]);

    const handleTaskUpdated = () => {
        setShowEdit(false);
        fetchTask();
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!task) return null;

    const priorityColors = {
        low: 'var(--success)',
        medium: 'var(--warning)',
        high: 'var(--danger)'
    };

    return (
        <div className="animate-fade-in pb-10">
            <button onClick={() => navigate('/')} className="btn text-text-light mb-4 text-sm flex items-center gap-2 pl-0 hover:text-primary">
                <FaArrowLeft /> Back to Dashboard
            </button>

            <div className="flex gap-6 flex-col lg:flex-row">
                {/* Main Content */}
                <div className="flex-1">
                    <div className="card mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-2xl font-bold">{task.title}</h1>
                            <button onClick={() => setShowEdit(true)} className="btn btn-secondary text-sm">
                                <FaEdit className="mr-2" /> Edit
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="badge badge-blue text-sm uppercase">{task.status.replace('-', ' ')}</div>
                            <div className="flex items-center gap-1 text-sm font-bold" style={{ color: priorityColors[task.priority] }}>
                                <FaFlag /> {task.priority.toUpperCase()}
                            </div>
                            {task.due_date && (
                                <div className="flex items-center gap-1 text-sm text-text-light">
                                    <FaCalendar /> Due: {format(new Date(task.due_date), 'PPP')}
                                </div>
                            )}
                        </div>

                        <div className="prose mb-6">
                            <h3 className="text-sm font-bold text-text-light uppercase tracking-wider mb-2">Description</h3>
                            <p className="whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
                        </div>

                        {task.tags && task.tags.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <FaTags className="text-text-light" />
                                {task.tags.map((tag, i) => (
                                    <span key={i} className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700">#{tag}</span>
                                ))}
                            </div>
                        )}
                        
                        {task.assigned_to && task.assigned_to.length > 0 && (
                             <div className="text-sm text-text-light mt-2">
                                <p><span className="font-bold">Assigned to:</span> {task.assigned_to.join(', ')}</p>
                                <p><span className="font-bold">Assigned By:</span> {task.user?.username || 'Unknown'}</p>
                             </div>
                        )}
                    </div>

                    <CommentSection taskId={task._id} />
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-1/3">
                    <FileSection taskId={task._id} />
                </div>
            </div>

            {showEdit && (
                <TaskForm 
                    taskToEdit={task} 
                    onClose={() => setShowEdit(false)} 
                    onTaskSaved={handleTaskUpdated} 
                />
            )}
        </div>
    );
};

export default TaskDetail;
