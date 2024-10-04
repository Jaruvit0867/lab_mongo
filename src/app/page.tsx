// src/app/page.tsx
import React from 'react';
import Tasks from '../components/Tasks'; // ระบุตำแหน่งที่ถูกต้องของ Tasks component

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>NextJS Todo CRUD With MongoDB</h1>
      <Tasks />
    </div>
  );
};

export default HomePage;