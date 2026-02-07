import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTasks, FaSignOutAlt, FaUser } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ 
            backgroundColor: 'var(--surface)', 
            borderBottom: '1px solid var(--border)',
            padding: '1rem 0' 
        }}>
            <div className="container flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold" style={{ color: 'var(--primary)' }}>
                    <FaTasks />
                    <span>TaskMaster</span>
                </Link>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    
                    {user ? (
                        <>
                            <div className="flex items-center gap-2 text-sm text-text-light">
                                <FaUser />
                                <span>{user.username}</span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-secondary text-sm">
                                <FaSignOutAlt className="mr-2" /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="btn btn-secondary text-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary text-sm">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
