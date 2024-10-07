import { useEffect, useState } from 'react';
import { ArrowLeft, Search, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Use react-router-dom for navigation
import { useFilterMembers } from '../../../../hooks/useEvents';
import Skeleton from 'react-loading-skeleton';
import withAuth from '../../../../app/authCheck';
import { DesktopHeader } from '../../../../components/partials/desktopHeader';

function StationMembersData() {
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate(); // Use useNavigate from react-router-dom
    const token = localStorage.getItem('token') || '';

    const [currentPage, setCurrentPage] = useState(1);
    const { data: membersData, isLoading: filterLoading } = useFilterMembers(token, "Outstation Member", currentPage);

    const members = membersData?.data || [];
    const pagination = membersData?.pagination || { current_page: 1, last_page: 1 };

    const handleNextPage = () => {
        if (currentPage < pagination.last_page) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };
    const skeletonRows = Array(5).fill(null);

    const filteredMembers = members?.filter((member: any) =>
        member.UserFamilyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.UserName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const [activeTab, setActiveTab] = useState('Account');

    const splitIntoChunks = (text: string, chunkSize: number) => {
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.slice(i, i + chunkSize));
        }
        return chunks;
    };

    return (
        <>
            <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="min-h-screen bg-white text-black">
                <div className="max-w-4xl mx-auto bg-white md:shadow-lg">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4">
                        <button onClick={() => navigate(-1)} className="text-blue-500 hover:text-blue-700 flex items-center">
                            <ArrowLeft className="h-5 w-5 mr-4" />
                            <p className='text-black font-medium'>Outstation Member</p>
                        </button>
                        <Link to="/dashboard/add-friend" state={"Outstation Member"}>
                            <button className="text-blue-500 hover:text-blue-700 flex items-center">
                                <Plus className="h-5 w-5 mr-1" />
                                New
                            </button>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="p-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Name"
                                className="w-full pl-10 pr-4 py-2 border rounded-md"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Members Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left">#</th>
                                    <th className="px-4 py-2 text-left">Family Name</th>
                                    <th className="px-4 py-2 text-left">Member Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterLoading ? (
                                    skeletonRows.map((_, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="px-4 py-2">
                                                <Skeleton width={20} />
                                            </td>
                                            <td className="px-4 py-2">
                                                <Skeleton width={150} />
                                            </td>
                                            <td className="px-4 py-2">
                                                <Skeleton width={150} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredMembers.length ? (
                                        filteredMembers.map((member: any, index: number) => (
                                            <tr
                                                key={member.id}
                                                className="border-t"
                                                onClick={() => navigate(`/dashboard/account/profile/${member.id}`)}
                                            >
                                                <td className="px-4 py-2">{(currentPage - 1) * pagination.per_page + index + 1}</td>

                                                <td className="px-4 py-2">
                                                    {splitIntoChunks(member.UserFamilyName, 15).map((chunk: string, i: number) => (
                                                        <p key={i}>{chunk}</p>
                                                    ))}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {splitIntoChunks(member.UserName, 15).map((chunk: string, i: number) => (
                                                        <p key={i}>{chunk}</p>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-2 text-center">
                                                No members found.
                                            </td>
                                        </tr>
                                    )


                                )}
                            </tbody>
                        </table>

                        <div className="flex justify-between mt-4">
                            <button
                                disabled={currentPage === 1}
                                onClick={handlePrevPage}
                                className={`px-4 py-2 ${currentPage === 1 ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
                            >
                                Previous
                            </button>

                            <span className="px-4 py-2">Page {pagination.current_page} of {pagination.last_page}</span>

                            <button
                                disabled={currentPage === pagination.last_page}
                                onClick={handleNextPage}
                                className={`px-4 py-2 ${currentPage === pagination.last_page ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>

    )
}

export default withAuth(StationMembersData);
