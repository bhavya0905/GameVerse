import { Outlet, useNavigationType } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect, useState } from 'react';

export default function Layout() {
  const [loading, setLoading] = useState(false);
  const transition = useNavigationType();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 300); // simulate loading delay
    return () => clearTimeout(timeout);
  }, [transition]);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem' }}>
            🔄 Loading...
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <Footer />
    </div>
  );
}
