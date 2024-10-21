'use client'

import React, { useState, useEffect } from 'react';
import { Calendar, User, ChevronRight, LogOut, Settings, Users, UserPlus, MapPin, KeyRound, FileUp } from 'lucide-react';
import { DesktopHeader } from '../../../components/partials/desktopHeader';
import { MobileHeader } from '../../../components/partials/mobileHeader';
import { Link, useNavigate } from 'react-router-dom';
import withAuth from '../../../app/authCheck';
import { getSampleCSV, membersExport, membersImport } from '../../../utils/api';
import Swal from 'sweetalert2';
import { ArrowLeft, Download } from 'lucide-react';
import Tippy from '@tippyjs/react';
// const userData = typeof window !== 'undefined' ? localStorage.getItem('user') || '' : '';
// const parsedData = userData ? JSON.parse(userData) : null;
// const userId = parsedData?.user.id;


function AccountSettings() {
    const [activeTab, setActiveTab] = useState('Account');
    const [userType, setUserType] = useState('');
    const [userId, setUserId] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const token = localStorage.getItem('token') || '';

    useEffect(() => {
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') || '' : '';
        const parsedData = userData ? JSON.parse(userData) : null;
        const userId = parsedData?.user.id;
        setUserId(userId)

    }, []);

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const accountItems = [
        { name: 'Profile', icon: User, route: `/dashboard/account/profile/${userId}` },
        // { name: 'Events', icon: Calendar, route: '/dashboard/events' },
        { name: 'Members Data', icon: Users, route: '/dashboard/account/members' },
        { name: 'Outstation Members Data', icon: MapPin, route: '/dashboard/account/station-member' },
        { name: 'Friends Data', icon: UserPlus, route: '/dashboard/account/friend' },
        { name: 'Change Password', icon: KeyRound, route: '/dashboard/account/change-password', },
        { name: 'Members Upload', icon: FileUp, route: '#', onClick: () => setIsModalOpen(true) },
        { name: 'Settings', icon: Settings, route: '/dashboard/account/settings' },
    ];

    useEffect(() => {
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') || '' : '';
        const parsedData = userData ? JSON.parse(userData) : null;
        const userType = parsedData?.user.UserType;
        setUserType(userType);
    }, []);

    const logout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out from your account.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log out!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Perform logout
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/'); // Redirect to the home page or login page
                Swal.fire(
                    'Logged Out!',
                    'You have been logged out successfully.',
                    'success'
                );
            }
        });
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert('Please select a file to upload');
            return;
        }
        try {
            setIsUploading(true);
            const response = await membersImport(token, file);
            console.log('Upload successful:', response);

            Swal.fire({
                icon: 'success',
                title: 'File uploaded successfully',
                confirmButtonText: 'OK',
            });

            setIsModalOpen(false);
        } catch (error: any) {
            if (error) {
                const csvBlob = new Blob([error], { type: 'text/csv' });
                const csvUrl = URL.createObjectURL(csvBlob);

                Swal.fire({
                    icon: 'error',
                    html: `<div style="font-size: 16px; line-height: 1.5;">There was an error during upload. Click 'Download' to get the error report.</div>`,
                    confirmButtonText: 'Download',
                }).then(() => {
                    const link = document.createElement('a');
                    link.href = csvUrl;
                    link.download = 'error_report.csv';  // Set file name
                    link.click();  // Trigger the download
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    html: `<div style="font-size: 16px; line-height: 1.5;">${error}</div>`,
                    confirmButtonText: 'OK',
                });
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleMembersExport = async () => {

        try {
            const response = await membersExport(token);

            // Create a URL for the downloaded file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.csv'); // Set the filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Clean up the link
        } catch (error: any) {
            console.error('Error downloading report:', error);
            alert(error.message); // Show error message
        } finally {
        }
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
                                        <Link to={item.route} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150" onClick={item.onClick ? item.onClick : undefined}
                                        >
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

                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-6 w-96">
                                <div className="flex justify-between">
                                    <h2 className="text-lg font-semibold mb-4">Upload Members File</h2>
                                    <div className="relative group">  {/* Add 'group' class to parent */}
                                        {/* <Tippy content="Download Sample CSV" placement="top" arrow={true}>
                                            <Download
                                                className="h-6 w-6 text-blue-400 cursor-pointer"
                                                onClick={async () => {
                                                    try {
                                                        await getSampleCSV(); // Call the download function
                                                    } catch (error: any) {
                                                        console.error('Failed to download CSV', error.message);
                                                    }
                                                }}
                                            />
                                        </Tippy> */}

                                        <Tippy content="Download Sample CSV" placement="top" arrow={true}>
                                            <Download
                                                className="h-6 w-6 text-blue-400 cursor-pointer"
                                                onClick={() => {
                                                    try {
                                                        // Create a temporary anchor element
                                                        const link = document.createElement('a');
                                                        link.href = 'https://tjc.wizappsystem.com/church/template.xlsx'; // URL to download
                                                        link.setAttribute('download', 'template.xlsx'); // Set download attribute
                                                        document.body.appendChild(link); // Append the link to the document
                                                        link.click(); // Programmatically click the link to trigger the download
                                                        document.body.removeChild(link); // Clean up by removing the link
                                                    } catch (error: any) {
                                                        console.error('Failed to download CSV', error.message);
                                                    }
                                                }}
                                            />
                                        </Tippy>

                                    </div>
                                </div>



                                <input
                                    type="file"
                                    accept=".xlsx, .xls, .csv"
                                    onChange={handleFileChange}
                                    className="mb-4"
                                />


                                <div className="flex justify-end">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2 flex items-center justify-center"
                                        onClick={handleFileUpload}
                                        disabled={isUploading} // Disable button during upload
                                    >
                                        {isUploading ? (
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                ></path>
                                            </svg>
                                        ) : (
                                            'Upload File'
                                        )}
                                    </button>

                                    <button
                                        className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 mr-2 rounded"
                                        onClick={handleMembersExport}
                                        disabled={isUploading} // Disable cancel button during upload
                                    >
                                        Download
                                    </button>

                                    <button
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={isUploading} // Disable cancel button during upload
                                    >
                                        Cancel
                                    </button>


                                </div>
                            </div>
                        </div>
                    )}

                    <button className="mt-4 flex items-center text-red-500 hover:text-red-600 transition-colors duration-150" onClick={logout}>
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                    </button>
                </div>
            </main >

            {/* Mobile Navigation */}
            < MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        </div >
    );
}

export default withAuth(AccountSettings);
