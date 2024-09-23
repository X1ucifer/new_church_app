import { useEffect, useState } from 'react';
import { ArrowLeft, Search, Plus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import withAuth from '../../../../app/authCheck';
import Skeleton from 'react-loading-skeleton';
import { useFilterMembers } from '../../../../hooks/useEvents';

function FriendData() {
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token') || '';
    
    const navigate = useNavigate();

    const { data: members, isLoading: filterLoading, isError } = useFilterMembers(token, "Friend");

    const filteredMembers = members?.filter((member: any) =>
        member.UserFamilyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.UserName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const skeletonRows = Array(5).fill(null);


    return (
        <div className="min-h-screen bg-white text-black">
            <div className="max-w-4xl mx-auto bg-white md:shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-4">
                    <button onClick={() => navigate(-1)} className="text-blue-500 hover:text-blue-700 flex items-center">
                        <ArrowLeft className="h-5 w-5 mr-4" />
                        <p className='text-black font-medium'>Friends</p>
                    </button>
                    <Link to="/dashboard/member" >
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
                            filteredMembers.map((member:any, index:number) => (
                                <tr
                                    key={member.id}
                                    className="border-t"
                                    onClick={() => navigate(`/dashboard/account/profile/${member.id}`)}
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{member.UserFamilyName}</td>
                                    <td className="px-4 py-2">{member.UserName}</td>
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
                </div>
              
            </div>
        </div>
    )
}

export default withAuth(FriendData);
