import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { FaTrash, FaDownload, FaFileUpload } from 'react-icons/fa';

const FileSection = ({ taskId }) => {
    const { token } = useAuth();
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const fetchFiles = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/files/task/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files', error);
        }
    };

    useEffect(() => {
        if (taskId) fetchFiles();
    }, [taskId]);

    const handleUpload = async (e) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) return;

        const formData = new FormData();
        for (let i = 0; i < fileList.length; i++) {
            formData.append('files', fileList[i]);
        }

        setUploading(true);
        try {
            await axios.post(`${API_URL}/files/${taskId}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchFiles();
        } catch (error) {
            alert('Error uploading file');
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this file?')) return;
        try {
            await axios.delete(`${API_URL}/files/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFiles(files.filter(f => f._id !== id));
        } catch (error) {
            alert('Error deleting file');
        }
    };

    const handleDownload = async (file) => {
        try {
            const response = await axios.get(`${API_URL}/files/download/${file._id}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.originalName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Download failed', error);
            alert('Download failed');
        }
    };

    return (
        <div className="card mt-4">
            <h3 className="text-lg mb-4 flex items-center justify-between">
                Attachments
                <label className="btn btn-primary text-sm cursor-pointer">
                    <FaFileUpload className="mr-2" /> Upload
                    <input type="file" multiple onChange={handleUpload} className="hidden" />
                </label>
            </h3>
            
            {uploading && <div className="text-sm text-text-light mb-2">Uploading...</div>}

            {files.length === 0 ? (
                <p className="text-text-light text-sm">No files attached.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {files.map(file => (
                        <div key={file._id} className="flex justify-between items-center p-2 border border-border rounded bg-background">
                            <span className="text-sm truncate" style={{ maxWidth: '70%' }}>{file.originalName}</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleDownload(file)} className="text-primary hover:text-primary-hover">
                                    <FaDownload />
                                </button>
                                <button onClick={() => handleDelete(file._id)} className="text-danger hover:text-red-700">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileSection;
