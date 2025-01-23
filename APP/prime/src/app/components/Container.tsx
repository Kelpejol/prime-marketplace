"use client"
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <main className="max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </div>
    </main>
  );
};

export default Container;