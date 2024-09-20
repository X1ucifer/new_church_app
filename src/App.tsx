import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboardpage from './app/dashboard/Dashboardpage';
import ChurchReport from './app/dashboard/reports/page';
import ChurchEvents from './app/dashboard/events/page';
import AccountSettings from './app/dashboard/account/page';
import ChurchLogin from './app/login/Loginpage';
import withAuth from './app/authCheck';
import AddMember from './app/dashboard/member/page';

const App: React.FC = () => {

  const AuthenticatedDashboard = withAuth(Dashboardpage);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<ChurchLogin />} />
        <Route path="/dashboard" element={<AuthenticatedDashboard />} />
        <Route path="/dashboard/reports" element={<ChurchReport />} />
        <Route path="/dashboard/events" element={<ChurchEvents />} />
        <Route path="/dashboard/account" element={<AccountSettings />} />
        <Route path="/dashboard/events/edit-event/:id" element={<AccountSettings />} />
        <Route path="/dashboard/member" element={<AddMember />} />
      </Routes>
    </Router>
  );
};

export default App;
