import { ReactNode } from 'react';
import Navbar from '@/layouts/navbar/Header';
import Footer from '@/layouts/footer/Footer';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

const MainLayout = ({ children, className = '' }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
