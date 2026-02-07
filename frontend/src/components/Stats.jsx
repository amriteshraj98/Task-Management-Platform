import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Stats = ({ refreshTrigger }) => {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/analytics`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats', error);
            }
        };

        fetchStats();
    }, [token, refreshTrigger]);

    if (!stats) return <div>Loading stats...</div>;

    const statusData = {
        labels: stats.statusStats.map(s => s._id),
        datasets: [
            {
                data: stats.statusStats.map(s => s.count),
                backgroundColor: [
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const priorityData = {
        labels: stats.priorityStats.map(p => p._id),
        datasets: [
            {
                label: 'Tasks by Priority',
                data: stats.priorityStats.map(p => p.count),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
            },
        ],
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="card flex-1">
                <h3 className="text-lg mb-4 text-center">Task Status</h3>
                <div style={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
                    <Pie 
                        data={statusData} 
                        options={{
                            plugins: {
                                legend: {
                                    align: 'center',
                                    labels: {
                                        boxWidth: 20,
                                        padding: 15
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>
            <div className="card flex-1">
                <h3 className="text-lg mb-4 text-center">Task Priority</h3>
                <div style={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
                    <Bar 
                        options={{ 
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    align: 'center',
                                    labels: {
                                        boxWidth: 20,
                                        padding: 15
                                    }
                                }
                            }
                        }} 
                        data={priorityData} 
                    />
                </div>
            </div>
            <div className="card flex-1 flex flex-col justify-center items-center">
                <h3 className="text-lg mb-2">Completion Rate</h3>
                <div className="text-4xl font-bold text-primary">
                    {Math.round(stats.completionRate)}%
                </div>
                <div className="text-sm text-text-light mt-2">
                    {stats.completedTasks} / {stats.totalTasks} Tasks Completed
                </div>
            </div>
        </div>
    );
};

export default Stats;
