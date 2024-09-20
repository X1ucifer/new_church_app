'use client'
import React, { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react';
import { ChevronRight, ChevronDown } from 'lucide-react'
import { DesktopHeader } from '../../../components/partials/desktopHeader'
import { MobileHeader } from '../../../components/partials/mobileHeader'
import axios from 'axios'


const baseUrl = 'https://tjc.wizappsystem.com/church/public/api'


export default function ChurchReport() {
  const [activeTab, setActiveTab] = useState('Report')
  const [reportItems, setReportItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [userList, setUserList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showFamiliesView, setShowFamiliesView] = useState(false)
  const [familyList, setFamilyList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredFamilies, setFilteredFamilies] = useState([])
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null)
  const [familyMembers, setFamilyMembers] = useState<{ [key: string]: any[] }>({})
  const [memberDetails, setMemberDetails] = useState(null)
  const [showReportUsersPage, setShowReportUsersPage] = useState(false)

  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''
  useEffect(() => {
    const fetchReportList = async () => {
      try {
        const response = await axios.get(`${baseUrl}/reportList`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const reportTypes = response.data.report_types || []
        setReportItems(reportTypes)
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch report items:', err)
        setError('Failed to fetch report items')
        setLoading(false)
      }
    }

    fetchReportList()
  }, [accessToken])


  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Logic for displaying current page users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userList.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages
  const totalPages = Math.ceil(userList.length / usersPerPage);

  // Function to go to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to go to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };




  const [currentPage1, setCurrentPage1] = useState(1);
  const itemsPerPage = 8;

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
    if (showFamiliesView) {
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
    }
  }, [showFamiliesView, accessToken])

  useEffect(() => {
    setFilteredFamilies(
      familyList.filter((family: any) =>
        family?.UserFamilyName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, familyList]);

  const handleItemClick = async (reportItem: any) => {
    setSelectedReport(reportItem.name)
    try {
      const response = await axios.get(`${baseUrl}/report`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          report_type: reportItem.value,
        },
      })
      setUserList(response.data.user || [])
      setShowReportUsersPage(true)  // Show the report users page
    } catch (err) {
      console.error('Error fetching report details:', err)
    }
  }
  const handleBackToReports = () => {
    setShowReportUsersPage(false)
    setSelectedReport(null)
  }


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

  const handleMemberClick = async (memberId: number) => {
    try {
      const response = await axios.get(`${baseUrl}/user/view-member-profile/1
Completed
/${memberId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setMemberDetails(response.data)
    } catch (err) {
      console.error('Error fetching member details:', err)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="min-h-screen bg-white flex flex-col text-black">
      <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {showFamiliesView ? (
          <div>
            <div onClick={handleBack} className="cursor-pointer">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Families</h2>
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
                              <button
                                key={member.id}
                                className="block p-2 w-full text-left text-blue-600 hover:underline"
                                onClick={() => handleMemberClick(member.id)}
                              >
                                {member.UserName}
                              </button>
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
            <div className="flex items-center justify-between mt-6">
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

          </div>

        ) : showReportUsersPage ? (
          <div className="min-h-screen bg-white flex flex-col text-black">
            {/* Desktop Header */}
            <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <main className="flex-grow container mx-auto p-4 md:p-8">
              <div onClick={handleBackToReports} className="cursor-pointer">
                <ArrowLeft className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Users for {selectedReport}</h2>

              <div className="flex flex-col h-[81vh] justify-between md:h-unset md:justify-normal">
                <div className="bg-white rounded-lg md:shadow overflow-hidden">
                  {userList.length > 0 ? (
                    <>
                      {/* Table Headings */}
                      <div className="p-4 flex justify-between bg-gray-100 font-bold">
                        <span className="text-gray-700 text-[15px]">Name</span>
                        <span className="text-gray-700 text-[15px]">Family Name</span>
                      </div>
                      <ul>
                        {currentUsers.map((user: any, index) => (
                          <li
                            key={user.id}
                            className={`${index !== 0 ? 'border-t border-gray-200' : ''}`}
                          >
                            <a
                              href={`/users/${user.id}`}
                              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150"
                            >
                              <div className="flex items-center">
                                <span className="text-gray-700 text-[15px]">{user.Username}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-700 text-[15px]">{user.UserFamilyName}</span>
                                <div className="h-5 w-5 text-gray-400" />
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>

                      {/* Pagination Controls */}
                      <div className="flex justify-between items-center p-4">
                        {/* Previous Button */}
                        <button
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1}
                          className={`p-2 text-blue-500 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-700'
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* Page Indicator */}
                        <span className="text-gray-700">
                          Page {currentPage} of {totalPages}
                        </span>

                        {/* Next Button */}
                        <button
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className={`p-2 text-blue-500 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-700'
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Report</h2>
            <div className="bg-white rounded-lg md:shadow overflow-hidden">
              <ul className='h-[100vh]'>
                {reportItems.map((item: any, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => handleItemClick(item)}
                    >
                      <span className="text-gray-700 text-[15px]">{item.name}</span>
                      <ChevronRight className="text-gray-400" />
                    </a>
                    {index < reportItems.length - 1 && <hr className="border-gray-200" />}
                  </li>
                ))}
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150"
                    onClick={handleFamiliesClick}
                  >
                    <span className="text-gray-700 text-[15px]">Families</span>
                    <ChevronRight className="text-gray-400" />
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}
      </main>
      <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )

}
