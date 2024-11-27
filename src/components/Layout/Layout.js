import React from 'react';
import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-4 sm:px-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Layout; 