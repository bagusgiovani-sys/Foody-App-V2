import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-[88px]">{children}</main>
      <Footer />
    </div>
  );
}
