import React, { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react';
import { ChevronRight, ChevronDown } from 'lucide-react'
import { DesktopHeader } from '../../../../components/partials/desktopHeader'
import { MobileHeader } from '../../../../components/partials/mobileHeader'
import axios from 'axios'
import { Link } from 'react-router-dom';
import withAuth from '../../../../app/authCheck';
import { useNavigate, useParams, useLocation } from 'react-router-dom'


const baseUrl = 'https://tjc.wizappsystem.com/church/public/api'

const Families = () => {
    const [activeTab, setActiveTab] = useState('Report')
    const [showFamiliesView, setShowFamiliesView] = useState(false)
    const [familyList, setFamilyList] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredFamilies, setFilteredFamilies] = useState([])
    const [expandedFamily, setExpandedFamily] = useState<string | null>(null)
    const [familyMembers, setFamilyMembers] = useState<{ [key: string]: any[] }>({})
    const [currentPage1, setCurrentPage1] = useState(1);
    const itemsPerPage = 8;

    const navigate = useNavigate();

    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

    // Calculate total pages based on the number of families
    const totalPages1 = Math.ceil(filteredFamilies.length / itemsPerPage);

    // Get families for the current page
    const paginatedFamilies = filteredFamilies.slice(
        (currentPage1 - 1) * itemsPerPage,
        currentPage1 * itemsPerPage
    );

    const goToNextPage = () => {
        if (currentPage1 < totalPages1) {
            setCurrentPage1(prevPage => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage1 > 1) {
            setCurrentPage1(prevPage => prevPage - 1);
        }
    };

    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                const response = await axios.get(`${baseUrl}/familyList`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                setFamilyList(response.data.families || [])
            } catch (err) {
                console.error('Error fetching family list:', err)
            }
        }

        fetchFamilies()

    }, [accessToken])

    useEffect(() => {
        setFilteredFamilies(
            familyList.filter((family: any) =>
                family?.UserFamilyName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, familyList]);



    const handleBack = () => {
        setShowFamiliesView(false)
    }

    const handleFamiliesClick = () => {
        setShowFamiliesView(true)
    }

    const toggleFamilyAccordion = async (familyName: string) => {
        if (expandedFamily === familyName) {
            setExpandedFamily(null)
        } else {
            setExpandedFamily(familyName)
            // Fetch family details
            try {
                const response = await axios.get(`${baseUrl}/familyDetails/${familyName}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                setFamilyMembers(prevState => ({
                    ...prevState,
                    [familyName]: response.data.users || [],
                }))
            } catch (err) {
                console.error('Error fetching family details:', err)
            }
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col text-black">
            <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-grow container mx-auto p-4 md:p-8">

                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-gray-800 mr-4"
                    >
                        <ArrowLeft className="h-6 w-6 text-blue-400" />
                    </button>
                    <h2 className="text-xl font-bold">Families</h2>
                </div>

                <input
                    type="text"
                    placeholder="Search families..."
                    className="p-2 border rounded w-full mb-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {paginatedFamilies.length > 0 ? (
                    <div className="space-y-4">
                        {paginatedFamilies.map((family: any) => (
                            <div key={family.UserFamilyName} className="border rounded-lg shadow-md">
                                <button
                                    className="flex items-center justify-between p-4 w-full text-left focus:outline-none"
                                    onClick={() => toggleFamilyAccordion(family.UserFamilyName)}
                                >
                                    <span className="text-gray-700 text-[15px]">{family.UserFamilyName}</span>
                                    {expandedFamily === family.UserFamilyName ? (
                                        <ChevronDown className="text-gray-400" />
                                    ) : (
                                        <ChevronRight className="text-gray-400" />
                                    )}
                                </button>
                                {expandedFamily === family.UserFamilyName && (
                                    <div className="p-4 border-t">
                                        {familyMembers[family.UserFamilyName] ? (
                                            <div className="space-y-2">
                                                {familyMembers[family.UserFamilyName].map(member => (
                                                    <Link to={`/dashboard/account/profile/${member.id}`} >
                                                        <button
                                                            key={member.id}
                                                            className="block p-2 w-full text-left text-blue-600 hover:underline"
                                                        >
                                                            {member.UserName}
                                                        </button>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>Loading family members...</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No families found</p>
                )}

                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-6 mb-[60px]">
                    {/* Previous Button */}
                    <button
                        className={`p-2 rounded-lg shadow-md transition-colors ${currentPage1 === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        disabled={currentPage1 === 1}
                        onClick={goToPreviousPage}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Page Indicator */}
                    <div className="text-gray-600">
                        <span className="font-semibold">Page {currentPage1}</span> of <span className="font-semibold">{totalPages1}</span>
                    </div>

                    {/* Next Button */}
                    <button
                        className={`p-2 rounded-lg shadow-md transition-colors ${currentPage1 === totalPages1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        disabled={currentPage1 === totalPages1}
                        onClick={goToNextPage}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

            </main>
            <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        </div>
    )
}

export default withAuth(Families);
