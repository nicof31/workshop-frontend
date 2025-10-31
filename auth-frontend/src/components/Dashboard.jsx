import React from 'react';
import DashboardLayout from './Layout/DashboardLayout';
import DashboardMain from './Dashboard/DashboardMain';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <DashboardMain />
    </DashboardLayout>
  );
};

export default Dashboard;