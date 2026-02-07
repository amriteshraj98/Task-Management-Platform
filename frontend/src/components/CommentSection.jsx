import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { FaTrash, FaUserCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const CommentSection = ({ taskId }) => {
    const { token, user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/comments/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments', error);
        }
    };

    useEffect(() => {
        if (taskId) fetchComments();
    }, [taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const { data } = await axios.post(`${API_URL}/comments/${taskId}`, { content: newComment }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments([...comments, data]);
            setNewComment('');
        } catch (error) {
            alert('Error posting comment');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete comment?')) return;
        try {
            await axios.delete(`${API_URL}/comments/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(comments.filter(c => c._id !== id));
        } catch (error) {
            alert('Error deleting comment');
        }
    };

    return (
        <div className="card mt-4">
            <h3 className="text-lg mb-4">Comments</h3>
            
            <div className="flex flex-col gap-4 mb-4 max-h-64 overflow-y-auto">
                {comments.length === 0 ? (
                    <p className="text-text-light text-sm">No comments yet.</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment._id} className="flex gap-3">
                            <FaUserCircle className="text-2xl text-text-light mt-1" />
                            <div className="flex-1 bg-background p-3 rounded-lg border border-border">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-sm">{comment.user.username}</span>
                                    <span className="text-xs text-text-light">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                                {user._id === comment.user._id && (
                                    <div className="flex justify-end mt-1">
                                        <button onClick={() => handleDelete(comment._id)} className="text-xs text-text-light hover:text-danger">Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                    className="input" 
                    placeholder="Add a comment..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" disabled={!newComment.trim()} className="btn btn-primary h-full">Post</button>
            </form>
        </div>
    );
};

export default CommentSection;
