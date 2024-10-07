'use client'
import React, { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react';
import { ChevronRight, ChevronDown } from 'lucide-react'
import { DesktopHeader } from '../../../components/partials/desktopHeader'
import { MobileHeader } from '../../../components/partials/mobileHeader'
import axios from 'axios'
import { Link } from 'react-router-dom';
import withAuth from '../../../app/authCheck';


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


  if (error) return <p>{error}</p>

  return (
    <div className="min-h-screen bg-white flex flex-col text-black pt-4 pb-16">
      <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {loading && (
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="border-t-transparent border-solid animate-spin border-blue-500 border-8 rounded-full w-16 h-16 border-t-8"></div>
        </div>
      )}
      <main className="flex-grow container mx-auto p-4 md:p-8">
      
        <h2 className="text-2xl font-bold mb-4">Report</h2>
        <div className="bg-white rounded-lg md:shadow overflow-hidden">
          <ul className=''>
            {reportItems.map((item: any, index) => (
              <li key={index}>
                <Link
                  to={`/dashboard/report-users/${item.value}`}
                  state={item.name}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <span className="text-gray-700 text-[15px]">{item.name}</span>
                  <ChevronRight className="text-gray-400" />
                </Link>
                {index < reportItems.length - 1 && <hr className="border-gray-200" />}
              </li>
            ))}
            <li>
              <Link
                to="/dashboard/reports/families"
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <span className="text-gray-700 text-[15px]">Families</span>
                <ChevronRight className="text-gray-400" />
              </Link>
            </li>
          </ul>
        </div>


      </main>
      <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )

}

export default withAuth(ChurchReport);
