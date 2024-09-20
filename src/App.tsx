import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboardpage from './app/dashboard/Dashboardpage';
import ChurchReport from './app/dashboard/reports/page';
import ChurchEvents from './app/dashboard/events/page';
import AccountSettings from './app/dashboard/account/page';
import MembersData from './app/dashboard/account/members/page';
import ChurchLogin from './app/login/Loginpage';
import withAuth from './app/authCheck';
import AddMember from './app/dashboard/member/page';
import UsageRights from './app/dashboard/account/settings/page';
import ForgotPassword from './app/forgot-password/page';
import OTPVerification from './app/forgot-password/otp/page';
import PasswordSetup from './app/forgot-password/reset-password/page';
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

        {/* Shamira */}
        <Route path="/dashboard/member" element={<AddMember />} />
        <Route path="/dashboard/account/members" element={<MembersData/>}/>
        <Route path="/dashboard/account/settings" element={<UsageRights/>}/>

        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/forgot-password/otp" element={<OTPVerification/>}/>
        <Route path="/forgot-password/reset-password" element={<PasswordSetup/>}/>


        

      </Routes>
    </Router>
  );
};

export default App;
