'use client'

import React, { useState } from 'react'
import { Calendar, User, ChevronRight, LogOut, Settings, Users, UserPlus, MapPin } from 'lucide-react'
import { DesktopHeader } from '@/components/partials/desktopHeader'
import { MobileHeader } from '@/components/partials/mobileHeader'
import Link from 'next/link';

const accountItems = [
    { name: 'Profile', icon: User, route: '/dashboard/account/profile' },
    { name: 'Events', icon: Calendar, route: '/dashboard/events' },
    { name: 'Members Data', icon: Users, route: '/dashboard/account/members' },
    { name: 'Out Station Members Data', icon: MapPin, route: '/dashboard/account/profile' },
    { name: 'Friends Data', icon: UserPlus, route: '/dashboard/account/profile' },
    { name: 'Settings', icon: Settings, route: '/dashboard/account/settings' },
]

export default function AccountSettings() {
    const [activeTab, setActiveTab] = useState('Account')
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
                            {accountItems.map((item, index) => (
                                <li key={index} className={index !== 0 ? 'border-t border-gray-200' : ''}>
                                    <Link href={item.route} passHref className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150">
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

                    <button className="mt-4 flex items-center text-red-500 hover:text-red-600 transition-colors duration-150">
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                    </button>
                </div>

            </main>

            {/* Mobile Navigation */}
            <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        </div>
    )
}