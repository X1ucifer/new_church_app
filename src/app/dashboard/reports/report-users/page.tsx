import React, { useState, useEffect } from 'react'
import { ArrowLeft, Download, Search } from 'lucide-react';
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

    const usersPerPage = 20;

    const { slug } = useParams<{ slug: any }>();
    const location = useLocation();
    const state: any | null = location.state as any | null;

    const navigate = useNavigate();

    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

    const handleSearch = (e: any) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1);
    }

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
            const response = await reportExport(accessToken, slug, searchTerm);

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
        <>
            <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="min-h-screen bg-white text-black">
                <div className="max-w-4xl mx-auto bg-white md:shadow-lg">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-blue-500 hover:text-blue-700 flex items-center"
                        >
                            <ArrowLeft className="h-5 w-5 mr-4" />
                            <p className="text-black font-medium">Users for {state}</p>
                        </button>
                        <div>
                            <button
                                onClick={handleExport} // Call handleExport on click
                                className="text-gray-600 hover:text-gray-800 flex items-center"
                                disabled={!isExportEnabled} // Disable button if conditions are not met
                            >
                                <Download className="h-5 w-5 text-blue-400 mr-1" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full pl-10 pr-4 py-2 border rounded-md"
                                value={searchTerm}
                                onChange={handleSearch} // Update search term on change
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left">#</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Family Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="text-center p-4">
                                            <svg
                                                className="animate-spin h-10 w-10 text-blue-500 mx-auto"
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
                                        </td>
                                    </tr>
                                ) : userList.length > 0 ? (
                                    userList.map((user: any, index: number) => (
                                        <tr
                                            key={user.id}
                                            onClick={() => navigate(`/dashboard/account/profile/${user.id}`)}
                                            className="border-t cursor-pointer hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-2">{(currentPage - 1) * usersPerPage + index + 1}</td>
                                            <td className="px-4 py-2">{user.Username}</td>
                                            <td className="px-4 py-2">{user.UserFamilyName}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-2 text-center">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="flex justify-between mt-4 mb-[30px]">
                            <button
                                disabled={currentPage === 1}
                                onClick={handlePrevPage}
                                className={`px-4 py-2 ${currentPage === 1 ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
                            >
                                Previous
                            </button>

                            <span className="px-4 py-2">
                                Page {currentPage} of {totalPages} from {userCount} Records
                            </span>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={handleNextPage}
                                className={`px-4 py-2 ${currentPage === totalPages ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Navigation */}
            <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        </>

    )

}

export default withAuth(ReportUsers);
