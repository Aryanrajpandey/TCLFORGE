import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  return (
    <div className="min-h-screen bg-cc-bg">
      <Navbar />
      <main className="pt-[64px] min-h-screen">
        <div className="animate-fade-in overflow-x-hidden">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}
