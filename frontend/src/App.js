import './App.css';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import NavRoute from './components/Routing/NavRoute';
import Members from './components/DetailPages/Members/Members';
import Equipment from './components/DetailPages/Equipment/Equipment';
import Classes from './components/DetailPages/Classes/Classes';
import Memberships from './components/DetailPages/Memberships/Memberships';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate replace to='/dashboard' />} />
      <Route exact path='/dashboard' element={<NavRoute />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route exact path='/members' element={<NavRoute />}>
        <Route index element={<Members />} />
      </Route>
      <Route exact path='/equipment' element={<NavRoute />}>
        <Route index element={<Equipment />} />
      </Route>
      <Route exact path='/classes' element={<NavRoute />}>
        <Route index element={<Classes />} />
      </Route>
      <Route exact path='/memberships' element={<NavRoute />}>
        <Route index element={<Memberships />} />
      </Route>
    </Routes>
  );
};

export default App;
