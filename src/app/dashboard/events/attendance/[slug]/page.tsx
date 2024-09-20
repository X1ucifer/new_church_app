"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Camera, ArrowLeft, Search, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEventDetails, useFilterMembers } from '@/hooks/useEvents';

const API_URL = 'https://tjc.wizappsystem.com/church/public/api/user/newFriends'; 
const Attendance = ({ params }: any) => {
    const [activeTab, setActiveTab] = useState('Members');
    const [eventDetails, setEventDetails] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState('');
    const [formData, setFormData] = useState({
        UserName: '',
        UserFamilyName: '',
        UserGender: 'Female',
        UserMaritalStatus: 'Single',
        UserDOB: '',
        UserPhone: '',
        UserEmail: '',
        UserAddress: '',
        UserType: 'Outstation Member',
        UserChurchName: '',
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    const userId: any = params.slug;

    const { data: event, isLoading, error } = useEventDetails(token, userId);
    const { data: members, isLoading: filterLoading, isError } = useFilterMembers(token, activeTab);

    useEffect(() => {
        if (event) {
            setEventDetails(event);
        }
    }, [event]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredMembers = members?.filter((member: any) =>
        member.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.memberName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('User added:', data);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="max-w-3xl mx-auto bg-white md:shadow-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <button onClick={() => router.back()} className="text-blue-500 hover:text-blue-700 flex items-center">
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        <p className='text-black font-medium'>Attendance</p>
                    </button>

                    <button onClick={handleOpenModal} className="text-blue-500 hover:text-blue-700 flex items-center">
                        <Plus className="h-5 w-5 mr-1" />
                        New Friends
                    </button>
                </div>

                <div className="bg-[#E1E1E1] rounded-lg shadow p-[10px] mb-4 m-[10px]">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-sm text-gray-500">Event Name</p>
                            <p className="font-medium">{eventDetails?.EventName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{eventDetails?.EventDate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium">{eventDetails?.EventTime}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Leader</p>
                            <p className="font-medium">{eventDetails?.EventLeader}</p>
                        </div>
                    </div>
                </div>

                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('Members')}
                        className={`py-2 px-4 text-sm font-medium ${activeTab === 'Members' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    >
                        Members
                    </button>
                    <button
                        onClick={() => setActiveTab('Attendance')}
                        className={`py-2 px-4 text-sm font-medium ${activeTab === 'Attendance' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    >
                        Attendance
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 px-4 border border-gray-300 rounded-lg"
                        />
                        <Search className="absolute top-2 right-3 text-gray-500" />
                    </div>
                </div>

                {/* Member List */}
                <div className="p-4">
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map((member: any) => (
                            <div key={member.id} className="border-b py-2">
                                <p className="font-medium">{member.familyName} {member.memberName}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No members found</p>
                    )}
                </div>
            </div>

            {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
                &times;
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-wrap -mx-2">
                    <div className="w-full px-2 mb-4">
                        <label htmlFor="UserName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            id="UserName"
                            name="UserName"
                            value={formData.UserName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    {/* Family Name field */}
                    <div className="w-1/2 px-2 mb-4">
                        <label htmlFor="UserFamilyName" className="block text-sm font-medium text-gray-700 mb-1">Family Name</label>
                        <input
                            type="text"
                            id="UserFamilyName"
                            name="UserFamilyName"
                            value={formData.UserFamilyName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required

                        />
                    </div>

                    {/* Gender field */}
                    <div className="w-1/2 px-2 mb-4">
                        <label htmlFor="UserGender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            id="UserGender"
                            name="UserGender"
                            value={formData.UserGender}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required

                        >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                        </select>
                    </div>

                    {/* Marital Status field */}
                    <div className="w-1/2 px-2 mb-4">
                        <label htmlFor="UserMaritalStatus" className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                        <select
                            id="UserMaritalStatus"
                            name="UserMaritalStatus"
                            value={formData.UserMaritalStatus}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required

                        >
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                        </select>
                    </div>

                    {/* Date of Birth field */}
                    <div className="w-1/2 px-2 mb-4">
                        <label htmlFor="UserDOB" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            id="UserDOB"
                            name="UserDOB"
                            value={formData.UserDOB}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required

                        />
                    </div>

                    {/* Phone field */}
                    <div className="w-1/2 px-2 mb-4">
                        <label htmlFor="UserPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="text"
                            id="UserPhone"
                            name="UserPhone"
                            value={formData.UserPhone}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required

                        />
                    </div>


                    <div className="w-1/2 px-2 mb-4">
                        <label htmlFor="UserChurchName" className="block text-sm font-medium text-gray-700 mb-1">Church Name</label>
                        <input
                            type="text"
                            id="UserChurchName"
                            name="UserChurchName"
                            value={formData.UserChurchName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required


                        />
                    </div>


                    {/* Email field (full row) */}
                    <div className="w-full px-2 mb-4">
                        <label htmlFor="UserEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="UserEmail"
                            name="UserEmail"
                            value={formData.UserEmail}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required

                        />
                    </div>

                    {/* Address field */}
                    <div className="w-1/2 px-2 mb-4">
                        <label htmlFor="UserAddress" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            type="text"
                            id="UserAddress"
                            name="UserAddress"
                            value={formData.UserAddress}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required

                        />
                    </div>

                    {/* User Type field */}
                    <div className="w-1/2 px-2 mb-4">
                        <label htmlFor="UserType" className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                        <select
                            id="UserType"
                            name="UserType"
                            value={formData.UserType}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required

                        >
                            <option value="Outstation Member">Outstation Member</option>
                            <option value="Friend">Friend</option>
                        </select>
                    </div>

                    {/* Church Name field */}
                  
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Save
                </button>
            </form>
        </div>
    </div>
)}



        </div>
    );
};

export default Attendance;
