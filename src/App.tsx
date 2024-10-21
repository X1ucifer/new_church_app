import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboardpage from './app/dashboard/Dashboardpage';
import ChurchReport from './app/dashboard/reports/page';
import ChurchEvents from './app/dashboard/events/page';
import AccountSettings from './app/dashboard/account/page';
import MembersData from './app/dashboard/account/members/page';
import UsageRights from './app/dashboard/account/settings/page';
import ChangePassword from './app/dashboard/account/change-password/page';
import CreatePasswordSetup from './app/dashboard/member/create-password/page';
import ForgotPassword from './app/forgot-password/page';
import OTPVerification from './app/forgot-password/otp/page';
import PasswordSetup from './app/forgot-password/reset-password/page';
import UserProfile from './app/dashboard/account/profile/page';
import EditEvent from './app/dashboard/events/edit-event/page';
import Attendance from './app/dashboard/events/attendance/page';
import UpdateMember from './app/dashboard/member/edit-member/page';
import ChurchLogin from './app/login/Loginpage';
import withAuth from './app/authCheck';
import AddMember from './app/dashboard/member/page';
import StationMembersData from './app/dashboard/account/station-member/page';
import FriendData from './app/dashboard/account/friend/page';
import Register from './app/register/page';
import RegisterPasswordSetup from './app/register/password/page';
import RegisterOTPVerification from './app/register/otp/page';
import AddFriend from './app/dashboard/events/attendance/add-friends/page';
import ReportUsers from './app/dashboard/reports/report-users/page';
import Families from './app/dashboard/reports/families/page';
import MemberAdd from './app/dashboard/account/members/add-member/page';
import 'tippy.js/dist/tippy.css';
import 'rc-time-picker/assets/index.css';

const App: React.FC = () => {
const AuthenticatedDashboard = withAuth(Dashboardpage);
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<ChurchLogin />} />

        <Route path="/register" element={<Register />} />
        <Route path="/register/set-password" element={<RegisterPasswordSetup />} />
        <Route path="/register/verify-otp" element={<RegisterOTPVerification />} />

        <Route path="/dashboard" element={<AuthenticatedDashboard />} />
        <Route path="/dashboard/reports" element={<ChurchReport />} />
        <Route path="/dashboard/events" element={<ChurchEvents />} />
        <Route path="/dashboard/add-friend" element={<AddFriend />} />
        <Route path="/dashboard/account" element={<AccountSettings />} />
        <Route path="/dashboard/member/create-password" element={<CreatePasswordSetup />} />
        <Route path="/dashboard/report-users/:slug" element={<ReportUsers />} />
        <Route path="/dashboard/reports/families" element={<Families />} />
        <Route path="/dashboard/account/add-member" element={<MemberAdd />} />

        {/* Shamira */}
        <Route path="/dashboard/account/station-member" element={<StationMembersData />} />
        <Route path="/dashboard/account/friend" element={<FriendData />} />
        <Route path="/dashboard/events/edit-event/:id" element={<EditEvent />} />
        <Route path="/dashboard/events/attendance/:id" element={<Attendance />} />
        <Route path="/dashboard/account/profile/:id" element={<UserProfile />} />
        <Route path="/dashboard/member/edit-member/:id" element={<UpdateMember />} />
        <Route path="/dashboard/member" element={<AddMember />} />
        <Route path="/dashboard/account/members" element={<MembersData/>}/>
        <Route path="/dashboard/account/settings" element={<UsageRights/>}/>
        <Route path="/dashboard/account/change-password" element={<ChangePassword/>}/>

        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/forgot-password/otp" element={<OTPVerification/>}/>
        <Route path="/forgot-password/reset-password" element={<PasswordSetup/>}/>

      </Routes>
    </Router>
  );
};

export default App;
