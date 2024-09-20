'use client'

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Search, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import withAuth from '../../../authCheck'; 
import { useMembersData, useSearchMembers } from '../../../../hooks/useMembersData';
import Skeleton from 'react-loading-skeleton';

function MembersData() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const router = useNavigate();
    const token = localStorage.getItem('token') || '';

    const { data: searchedMembers, isLoading: isSearchLoading, error: searchError } = useSearchMembers(token, searchTerm);
    const navigate = useNavigate();

    const {
        data: paginatedData,
        error: paginationError,
        isLoading: isPaginationLoading,
        isError: isPaginationError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useMembersData(token);

    const loadMoreRef = useRef<HTMLDivElement>(null);

    const paginatedMembers = paginatedData?.pages.flatMap((page) => page.users) || [];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [loadMoreRef, fetchNextPage, hasNextPage]);

    const skeletonRows = Array(5).fill(null);

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="max-w-4xl mx-auto bg-white md:shadow-lg">
                <div className="flex justify-between items-center p-4">
                    <button onClick={() => navigate(-1)} className="text-blue-500 hover:text-blue-700 flex items-center">
                        <ArrowLeft className="h-5 w-5 mr-4" />
                        <p className='text-black font-medium'>Members Data</p>
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
                            {isSearchLoading || isPaginationLoading ? (
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
                                (searchTerm ? searchedMembers : paginatedMembers)?.length ? (
                                    (searchTerm ? searchedMembers : paginatedMembers).map((member: any, index: number) => (
                                        <tr key={member.id} className="border-t" onClick={() => navigate(`/dashboard/account/profile/${member.id}`,)} 
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
                <div ref={loadMoreRef} className="h-10 mt-4 flex justify-center items-center">
                    {isFetchingNextPage ? <span>Loading more members...</span> : null}
                </div>
            </div>
        </div>
    )
}

export default withAuth(MembersData);
