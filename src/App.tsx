import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboardpage from './app/dashboard/Dashboardpage';
import ChurchReport from './app/dashboard/reports/page';
import ChurchLogin from './app/login/Loginpage';
import withAuth from './app/authCheck';

const App: React.FC = () => {

  const AuthenticatedDashboard = withAuth(Dashboardpage);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<ChurchLogin />} />
        <Route path="/dashboard" element={<AuthenticatedDashboard />} />
        <Route path="/dashboard/reports" element={<ChurchReport />} />
      </Routes>
    </Router>
  );
};

export default App;
