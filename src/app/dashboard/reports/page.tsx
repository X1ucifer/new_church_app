'use client'
import React, { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { DesktopHeader } from '@/components/partials/desktopHeader'
import { MobileHeader } from '@/components/partials/mobileHeader'
import axios from 'axios'
import withAuth from '@/app/authCheck'
import { ArrowLeft, X } from 'lucide-react';

const baseUrl = 'https://tjc.wizappsystem.com/church/public/api'

function ChurchReport() {
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
      setShowModal(true)
    } catch (err) {
      console.error('Error fetching report details:', err)
    }
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
      const response = await axios.get(`${baseUrl}/memberDetails/${memberId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setMemberDetails(response.data)
    } catch (err) {
      console.error('Error fetching member details:', err)
    }
  }

  if (error) return <p>{error}</p>

  return (
    <div className="min-h-screen bg-white flex flex-col text-black">
      <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {showFamiliesView ? (
          <div>
            <div

              onClick={handleBack}
            >
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
            {filteredFamilies.length > 0 ? (
              <div className="space-y-4">
                {filteredFamilies.map((family: any) => (
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



            {/* Modal for displaying report users */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="relative bg-white p-6 rounded-lg w-full max-w-lg h-[400px] flex flex-col">
                  <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <h3 className="text-xl font-bold mb-4">Users for {selectedReport}</h3>
                  <div className="flex-grow overflow-y-auto">
                    <ul className="space-y-2">
                      {userList.length > 0 ? (
                        userList.map((user: any) => (
                          <li key={user.id} className="text-gray-700">
                            {user.Username}
                          </li>
                        ))
                      ) : (
                        <p>No users found</p>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Modal for displaying member details */}
            {memberDetails && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                  <h3 className="text-xl font-bold mb-4">Member Details</h3>
                  <pre>{JSON.stringify(memberDetails, null, 2)}</pre>
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setMemberDetails(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}


export default withAuth(ChurchReport);
