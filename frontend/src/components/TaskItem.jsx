import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaCalendar, FaFlag } from 'react-icons/fa';

const TaskItem = ({ task, onEdit, onDelete }) => {
    const navigate = useNavigate();

    const priorityColors = {
        low: 'var(--success)',
        medium: 'var(--warning)',
        high: 'var(--danger)'
    };

    const statusBadges = {
        'todo': 'badge-yellow',
        'in-progress': 'badge-blue',
        'completed': 'badge-green'
    };

    return (
        <div className="card mb-4" style={{ borderLeft: `4px solid ${priorityColors[task.priority]}` }}>
            <div className="flex justify-between items-start">
                <div onClick={() => navigate(`/tasks/${task._id}`)} style={{ cursor: 'pointer', flex: 1 }}>
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg">{task.title}</h3>
                        <span className={`badge ${statusBadges[task.status] || 'badge-blue'}`}>
                            {task.status.replace('-', ' ')}
                        </span>
                    </div>
                    {task.description && <p className="text-text-light text-sm mb-3 line-clamp-2">{task.description}</p>}
                    
                    <div className="flex gap-4 text-xs text-text-light">
                        {task.due_date && (
                            <div className="flex items-center gap-1">
                                <FaCalendar />
                                <span>{format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <FaFlag style={{ color: priorityColors[task.priority] }} />
                            <span style={{ textTransform: 'capitalize' }}>{task.priority}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                    <button onClick={() => onEdit(task)} className="text-text-light hover:text-primary">
                        <FaEdit />
                    </button>
                    <button onClick={() => onDelete(task._id)} className="text-text-light hover:text-danger">
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
