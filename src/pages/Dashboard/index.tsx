import React from 'react';
import WelcomeBar from './components/WelcomeBar';
import DashboardCharts from './components/DashboardCharts';
import { useUser } from '../../hooks/useUser';

const Dashboard: React.FC = () => {
  const { userData } = useUser();

  return (
    <div className="min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 space-y-6">
        <WelcomeBar userName={userData?.name || ''} />
        <DashboardCharts />
      </div>
    </div>
  );
};

export default Dashboard;
