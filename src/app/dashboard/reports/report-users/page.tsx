import React, { useState, useEffect } from 'react'
import { ArrowLeft, Download } from 'lucide-react';
import { ChevronRight, ChevronDown } from 'lucide-react'
import { DesktopHeader } from '../../../../components/partials/desktopHeader'
import { MobileHeader } from '../../../../components/partials/mobileHeader'
import axios from 'axios'
import { Link } from 'react-router-dom';
import withAuth from '../../../../app/authCheck';
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { reportExport, reportUsers } from '../../../../utils/api';


function ReportUsers() {
    const [activeTab, setActiveTab] = useState('Report')
    const [userList, setUserList] = useState([])
    const [userCount, setUserCount] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isExportEnabled, setIsExportEnabled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [loading, setLoading] = useState(true);

    const usersPerPage = 10;

    const { slug } = useParams<{ slug: any }>();
    const location = useLocation();
    const state: any | null = location.state as any | null;

    const navigate = useNavigate();

    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

    const fetchReportDetails = async (page = 1, searchTerm = '') => {
        if (!slug) return; // Exit if slug is not available

        setLoading(true); // Set loading to true before the request
        try {
            const response = await reportUsers(accessToken, slug, page, searchTerm);

            setUserList(response.data.user || []);
            setUserCount(response.data.count || 0);
            setCurrentPage(response.data.current_page || 1);
            setTotalPages(response.data.last_page || 1);
        } catch (err) {
            console.error('Error fetching report details:', err);
        } finally {
            setLoading(false); // Set loading to false after the request completes
        }
    };

    useEffect(() => {
        fetchReportDetails(currentPage, searchTerm); // Fetch report details when slug, page, or searchTerm changes
    }, [slug, currentPage, searchTerm]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    useEffect(() => {
        // Enable the export button if slug is defined and token exists
        setIsExportEnabled(!!slug);
    }, [slug]);

    const handleExport = async () => {
        try {
            // Call the report export function to fetch the CSV
            const response = await reportExport(accessToken, slug);

            // Assuming the response contains the CSV data directly as text or Blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));

            // Create a temporary link element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${slug}_report.csv`); // Use CSV extension for the file

            // Append the link to the body, click it to trigger download, then remove it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to export report:', error);
        }
    };



    return (
        <div className="min-h-screen bg-white flex flex-col text-black">
            {/* Desktop Header */}
            <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <div className="flex items-center mb-6 justify-between">
                    <div className='flex'>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-gray-800 mr-4"
                        >
                            <ArrowLeft className="h-6 w-6 text-blue-400" />
                        </button>
                        <h2 className="text-xl font-bold">Users for {state}</h2>
                    </div>


                    <div>
                        <button
                            onClick={handleExport} // Call handleExport on click
                            className="ml-4 text-gray-600 hover:text-gray-800 flex float-right"
                            disabled={!isExportEnabled} // Disable button if conditions are not met
                        >
                            <Download className="h-6 w-6 text-blue-400" />
                            <span className="ml-1">Export</span>
                        </button>
                    </div>


                </div>

                <input
                    type="text"
                    placeholder="Search users..."
                    className="p-2 border rounded w-full mb-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
                />


                <div className="">
                    <div className="bg-white h-[80vh] rounded-lg md:shadow overflow-hidden overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <svg
                                    className="animate-spin h-10 w-10 text-blue-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12c0-1.16.17-2.27.48-3.32l1.63.64C6.24 9.48 6 10.7 6 12s.24 2.52.68 3.68l-1.63.64C4.17 14.27 4 13.16 4 12z"
                                    />
                                </svg>
                            </div>
                        ) : userList.length > 0 ? (
                            <>
                                {/* Table Headings */}
                                <div className="p-4">
                                    <div className="flex justify-between bg-gray-100 font-bold sticky top-0 z-10 p-[20px]">
                                        <span className="text-gray-700 text-[15px]">Name</span>
                                        <span className="text-gray-700 text-[15px]">Family Name</span>
                                    </div>
                                    <ul>
                                        {userList.map((user: any, index: number) => (
                                            <li
                                                key={user.id}
                                                className={`${index !== 0 ? 'border-t border-gray-200' : ''
                                                    }`}
                                            >
                                                <Link
                                                    to={`/dashboard/account/profile/${user.id}`}
                                                    state={{ activeTab: 'Report' }}
                                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <div className="flex items-center">
                                                        <span className="text-gray-700 text-[15px]">
                                                            {user.Username}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-gray-700 text-[15px]">
                                                            {user.UserFamilyName}
                                                        </span>
                                                        <div className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex justify-between items-center p-4">
                                    {/* Previous Button */}
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className={`p-2 text-blue-500 transition-colors ${currentPage === 1
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:text-blue-700'
                                            }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                    </button>

                                    {/* Page Indicator */}
                                    <span className="text-gray-700">
                                        Page {currentPage} of {totalPages} from {userCount} Records
                                    </span>

                                    {/* Next Button */}
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 text-blue-500 transition-colors ${currentPage === totalPages
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:text-blue-700'
                                            }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="p-4">No users found</p>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile Navigation */}
            <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    )
}

export default withAuth(ReportUsers);
