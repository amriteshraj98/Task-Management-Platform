import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '2rem 0' }}>
                <div className="container">
                    {children}
                </div>
            </main>
            <footer style={{ 
                textAlign: 'center', 
                padding: '1.5rem', 
                color: 'var(--text-light)',
                borderTop: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                marginTop: 'auto'
            }}>
                <div className="container text-sm">
                    &copy; {new Date().getFullYear()} TaskMaster. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
