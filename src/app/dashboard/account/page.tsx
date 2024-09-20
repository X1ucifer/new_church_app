'use client'

import React, { useState, useEffect } from 'react';
import { Calendar, User, ChevronRight, LogOut, Settings, Users, UserPlus, MapPin } from 'lucide-react';
import { DesktopHeader } from '../../../components/partials/desktopHeader';
import { MobileHeader } from '../../../components/partials/mobileHeader';
import { Link, useNavigate } from 'react-router-dom';
import withAuth from '../../../app/authCheck';

const userData = typeof window !== 'undefined' ? localStorage.getItem('user') || '' : '';
const parsedData = userData ? JSON.parse(userData) : null;
const userId = parsedData?.user.id;

const accountItems = [
    { name: 'Profile', icon: User, route: `/dashboard/account/profile/${userId}` },
    { name: 'Events', icon: Calendar, route: '/dashboard/events' },
    { name: 'Members Data', icon: Users, route: '/dashboard/account/members' },
    { name: 'Out Station Members Data', icon: MapPin, route: '/dashboard/account/station-member' },
    { name: 'Friends Data', icon: UserPlus, route: '/dashboard/account/friend' },
    { name: 'Settings', icon: Settings, route: '/dashboard/account/settings' }
];

function AccountSettings() {
    const [activeTab, setActiveTab] = useState('Account');
    const [userType, setUserType] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') || '' : '';
        const parsedData = userData ? JSON.parse(userData) : null;
        const userType = parsedData?.user.UserType;
        setUserType(userType);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/'); // Use useNavigate from react-router-dom
    };

    return (
        <div className="min-h-screen bg-white flex flex-col text-black">
            {/* Desktop Header */}
            <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <h2 className="text-2xl font-bold mb-4">Account</h2>

                <div className='flex flex-col h-[81vh] justify-between md:h-unset md:justify-normal'>
                    <div className="bg-white rounded-lg md:shadow overflow-hidden">
                        <ul>
                            {accountItems
                                .filter(item => userType === "Admin" || item.name !== "Settings")
                                .map((item, index) => (
                                    <li key={index} className={index !== 0 ? 'border-t border-gray-200' : ''}>
                                        <Link to={item.route} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150">
                                            <div className="flex items-center">
                                                <item.icon className="h-5 w-5 text-gray-400 mr-3" />
                                                <span className="text-gray-700 text-[15px]">{item.name}</span>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    <button className="mt-4 flex items-center text-red-500 hover:text-red-600 transition-colors duration-150" onClick={logout}>
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                    </button>
                </div>
            </main>

            {/* Mobile Navigation */}
            <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}

export default withAuth(AccountSettings);
