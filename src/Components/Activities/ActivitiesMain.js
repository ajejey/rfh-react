import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ActivitiesList from './ActivitiesList';
import ActivityDetail from './ActivityDetail';

function ActivitiesMain() {
  return (
    <Routes>
      <Route path="/" element={<ActivitiesList />} />
      <Route path="/:slug" element={<ActivityDetail />} />
    </Routes>
  );
}

export default ActivitiesMain;
