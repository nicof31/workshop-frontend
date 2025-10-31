import React from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import StatsDashboard from './StatsDashboard';

const StatsPage = () => {
  return (
    <DashboardLayout>
      <StatsDashboard />
    </DashboardLayout>
  );
};

export default StatsPage;