import { useState } from 'react';
import Stats from '../components/Stats';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { FaPlus } from 'react-icons/fa';

const Dashboard = () => {
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleTaskSaved = () => {
        setShowTaskForm(false);
        setTaskToEdit(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setShowTaskForm(true);
    };

    const handleAddNew = () => {
        setTaskToEdit(null);
        setShowTaskForm(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <button onClick={handleAddNew} className="btn btn-primary">
                    <FaPlus className="mr-2" /> New Task
                </button>
            </div>

            <Stats refreshTrigger={refreshTrigger} />
            
            <h2 className="text-xl font-bold mb-4">Your Tasks</h2>
            <TaskList 
                refreshTrigger={refreshTrigger} 
                onEditTask={handleEditTask}
                triggerRefresh={() => setRefreshTrigger(prev => prev + 1)} 
            />

            {showTaskForm && (
                <TaskForm 
                    taskToEdit={taskToEdit} 
                    onClose={() => setShowTaskForm(false)} 
                    onTaskSaved={handleTaskSaved} 
                />
            )}
        </div>
    );
};

export default Dashboard;
