import './App.css';
import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate replace to='/dashboard' />} />

      <Route exact path='/dashboard' element={<Dashboard />} />
    </Routes>
  );
};

export default App;
