import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { ArrowLeft, Search, Plus, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAddendance, useEventDetails, useFilterMembers } from '../../../../hooks/useEvents';
import { updateAttendance } from '../../../../utils/api';
import withAuth from '../../../../app/authCheck';
import Swal from 'sweetalert2';
import { DesktopHeader } from '../../../../components/partials/desktopHeader';
import { useQueryClient } from 'react-query';

const API_URL = 'https://tjc.wizappsystem.com/church/public/api/user/newFriends';


interface EventDetails {
    EventName: string;
    EventType: string;
    EventDate: string;
    EventTime: string;
    EventLeader: string;
    EventChurchName: string;
    totalattendance: string;
}

interface Member {
    id: number;
    UserFamilyName: string;
    UserName: string;
    isMarked: string;
}

interface FormData {
    UserName: string;
    UserFamilyName: string;
    UserGender: string;
    UserMaritalStatus: string;
    UserDOB: string;
    UserPhone: string;
    UserEmail: string;
    UserAddress: string;
    UserType: string;
    UserChurchName: string;
}

const Attendance: React.FC<any> = () => {
    const [activeTab, setActiveTab] = useState<string>('Member');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        UserName: '',
        UserFamilyName: '',
        UserGender: 'Female',
        UserMaritalStatus: 'Single',
        UserDOB: '',
        UserPhone: '',
        UserEmail: '',
        UserAddress: '',
        UserType: 'Outstation Member',
        UserChurchName: '',
    });

    // const [selectedMembers, setSelectedMembers] = useState<{ [key: string]: number[] }>({
    //     Member: [],
    //     Friend: [],
    //     'Outstation Member': []
    //   });

    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const token = localStorage.getItem('token') || '';
    const userId: any = id;

    const { data: event } = useEventDetails(token, userId);
    const { data: attendance } = useAddendance(token, userId);
    const [isPageLoading, setIsPageLoading] = useState(false);

   
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = (e:any)=>{
        setSearchTerm(e.target.value)
        setCurrentPage(1);
    }

    const { data: membersData, isLoading } = useFilterMembers(token, activeTab, currentPage,searchTerm, userId);

    const members = membersData?.data || [];
    const pagination = membersData?.pagination || { current_page: 1, last_page: 1 };

    const handleNextPage = async () => {
        if (currentPage < pagination.last_page) {
            setIsPageLoading(true); // Start page loading
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = async () => {
        if (currentPage > 1) {
            setIsPageLoading(true); // Start page loading
            setCurrentPage(prevPage => prevPage - 1);
        }
    };


    useEffect(() => {
        if (!isLoading) {
            setIsPageLoading(false);
        }
    }, [membersData, isLoading]);


    useEffect(() => {
        if (event) {
            setEventDetails(event);
        }
    }, [event]);

    //   const handleAttendanceChange = (id: number) => {
    //     setSelectedMembers((prevSelected) =>
    //       prevSelected.includes(id)
    //         ? prevSelected.filter((memberId) => memberId !== id)
    //         : [...prevSelected, id]
    //     );
    //   };

    // Initialize selectedMembers with pre-marked members
    useEffect(() => {
        if (members) {
            const initiallySelected = members
                .filter((member: any) => member.isMarked == "1")
                .map((member: any) => member.id);
            setSelectedMembers(initiallySelected);
        }
    }, [members]);

    useEffect(() => {
        const storedData = localStorage.getItem('selectedMembers');
        if (storedData) {
            setSelectedMembers(JSON.parse(storedData) || []); // Ensure it's an array
        }
    }, []);

    // Store selected members in localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('selectedMembers', JSON.stringify(selectedMembers));
    }, [selectedMembers]);


    // const handleAttendanceChange = (id: number) => {
    //     setSelectedMembers((prevSelected) => {
    //         if (prevSelected.includes(id)) {
    //             // If already selected, remove from selectedMembers (unmark)
    //             return prevSelected.filter((memberId) => memberId !== id);
    //         } else {
    //             // Otherwise, add to selectedMembers (mark)
    //             return [...prevSelected, id];
    //         }
    //     });
    // };

    // const handleAttendanceChange = async (memberId: string) => {
    //     const memberIdAsNumber = Number(memberId);
    //     let updatedSelectedMembers: any;

    //     // Check if the member is already selected
    //     if (selectedMembers.includes(memberId as any)) {
    //         // Remove member from selectedMembers if it's already selected
    //         updatedSelectedMembers = selectedMembers.filter(id => id !== memberIdAsNumber);
    //     } else {
    //         // Add the member to selectedMembers if it's not selected
    //         updatedSelectedMembers = [...selectedMembers, memberId];
    //     }

    //     // Update the selected members state
    //     setSelectedMembers(updatedSelectedMembers);

    //     // Prepare data for the API call
    //     const data = {
    //         UserType: activeTab, // Assuming activeTab is related to attendance type or user role
    //         users: updatedSelectedMembers, // Send the updated members
    //     };

    //     // Make the API call to update attendance for the selected members
    //     try {
    //         await updateAttendance(token, userId, data); // Replace with your actual API function
    //         console.log('Attendance updated successfully:', data);
    //     } catch (error) {
    //         console.error('Error updating attendance:', error);
    //         // Optionally, you can handle the error here (e.g., show a message)
    //     }
    // };

    const handleAttendanceChange = async (memberId: string) => {
        const memberIdAsNumber = Number(memberId);
        let updatedSelectedMembers: any;

        // Check if the member is already selected
        if (selectedMembers.includes(memberIdAsNumber)) {
            // Member is unselected, update selectedMembers
            updatedSelectedMembers = selectedMembers.filter(id => id !== memberIdAsNumber);

            // Prepare data to send the unselected member's ID
            const data = {
                UserType: activeTab, // Assuming activeTab relates to attendance type or user role
                users: [memberIdAsNumber], // Send only the unselected memberId in the array
            };

            // Make the API call for unselect
            try {
                await updateAttendance(token, userId, data); // Replace with your actual API function
                queryClient.invalidateQueries('eventDetails');

                console.log('Attendance unselected successfully:', data);
            } catch (error) {
                console.error('Error unselecting attendance:', error);
            }
        } else {
            // Member is selected, update selectedMembers
            updatedSelectedMembers = [...selectedMembers, memberIdAsNumber];

            // Prepare data to send the selected member's ID
            const data = {
                UserType: activeTab, // Assuming activeTab relates to attendance type or user role
                users: [memberIdAsNumber], // Send only the selected memberId in the array
            };

            // Make the API call for select
            try {
                await updateAttendance(token, userId, data); 
                queryClient.invalidateQueries('eventDetails');

                console.log('Attendance selected successfully:', data);
            } catch (error) {
                console.error('Error selecting attendance:', error);
            }
        }

        // Update the selected members state
        setSelectedMembers(updatedSelectedMembers);
    };


    const filteredMembers = members?.filter((member: any) =>
        member.UserFamilyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.UserName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
    
    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('User added:', data);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };


    return (
        <div className="min-h-screen bg-white text-black">
            <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="max-w-3xl mx-auto bg-white md:shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <button onClick={() => navigate(-1)} className="text-blue-500 hover:text-blue-700 flex items-center">
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        <p className='text-black font-medium'>Attendance</p>
                    </button>
                    <Link to="/dashboard/add-friend">
                        <button className="text-blue-500 hover:text-blue-700 flex items-center">
                            <Plus className="h-5 w-5 mr-1" />
                            New Friends
                        </button>
                    </Link>
                </div>

                {/* Event Details */}
                <div className="bg-[#E1E1E1] rounded-lg shadow p-[10px] mb-4 m-[10px]">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-sm text-gray-500">Event Name</p>
                            <p className="font-medium">{eventDetails?.EventName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Event Type</p>
                            <p className="font-medium">{eventDetails?.EventType}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{eventDetails?.EventDate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium">{eventDetails?.EventTime}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Leader</p>
                            <p className="font-medium">{eventDetails?.EventLeader}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Church Name</p>
                            <p className="font-medium">{eventDetails?.EventChurchName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Attendance</p>
                            <p className="font-medium">{eventDetails?.totalattendance}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    {['Member', 'Friend', 'Outstation Member'].map((tab) => (
                        <button
                            key={tab}
                            className={`flex-1 py-2 px-4 text-center ${activeTab == tab
                                ? 'text-blue-500 border-b-2 border-blue-500 font-medium'
                                : 'text-gray-500'
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="p-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Name"
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {/* Members Table */}
                <div className="px-4 pb-4">
                    <div className="overflow-y-auto"> {/* Set a max height and allow vertical scrolling */}


                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500">
                                    <th className="py-2">#</th>
                                    <th className="py-2">Family Name</th>
                                    <th className="py-2">Member Name</th>
                                    <th className="py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading || isPageLoading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">
                                            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status">
                                                <span className="visually-hidden"></span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMembers.map((member: any, index: number) => (
                                        <tr key={member.id} className="border-t">
                                            <td className="py-2">{(currentPage - 1) * pagination.per_page + index + 1}</td>
                                            <td className="py-2 max-w-[140px] break-words">
                                                {member.UserFamilyName}
                                            </td>
                                            <td className="py-2 max-w-[140px] break-words">
                                                {member.UserName}
                                            </td>
                                            <td className="py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMembers.includes(member.id)}
                                                    onChange={() => handleAttendanceChange(member.id)}
                                                    className="h-5 w-5 text-blue-600 rounded"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="flex justify-between mt-4">
                            <button
                                disabled={currentPage == 1 || isPageLoading}
                                onClick={handlePrevPage}
                                className={`px-4 py-2 ${currentPage == 1 || isPageLoading ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
                            >
                                Previous
                            </button>

                            <span className="px-4 py-2">Page {pagination.current_page} of {pagination.last_page}</span>

                            <button
                                disabled={currentPage == pagination.last_page || isPageLoading}
                                onClick={handleNextPage}
                                className={`px-4 py-2 ${currentPage == pagination.last_page || isPageLoading ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
                            >
                                Next
                            </button>
                        </div>

                    </div>
                </div>


                {/* Save Button */}
                {/* <div className="p-4 border-t">
                    <button onClick={handleSubmitAttendance}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
                        Save
                    </button>
                </div> */}
            </div>


        </div>
    )
}

export default withAuth(Attendance);
