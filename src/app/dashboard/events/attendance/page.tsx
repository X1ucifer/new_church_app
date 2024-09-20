import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { ArrowLeft, Search, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAddendance, useEventDetails, useFilterMembers } from '../../../../hooks/useEvents';
import { updateAttendance } from '../../../../utils/api';
import withAuth from '../../../../app/authCheck';
import Swal from 'sweetalert2';

const API_URL = 'https://tjc.wizappsystem.com/church/public/api/user/newFriends';


interface EventDetails {
  EventName: string;
  EventType: string;
  EventDate: string;
  EventTime: string;
  EventLeader: string;
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

  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';
  const userId:any = id;

  const { data: event } = useEventDetails(token, userId);
  const { data: attendance } = useAddendance(token, userId);
  const { data: members } = useFilterMembers(token, activeTab, userId);

  useEffect(() => {
    if (event) {
      setEventDetails(event);
    }
  }, [event]);

  const handleAttendanceChange = (id: number) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((memberId) => memberId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSubmitAttendance = async () => {
    try {
      await updateAttendance(token, userId, selectedMembers);
      Swal.fire({
        icon: 'success',
        title: 'Successful',
        text: 'Attendance added!',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error submitting attendance:', error);
    }
  };

  const filteredMembers = members?.filter(
    (member: Member) =>
      member.UserFamilyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.UserName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);


    return (
        <div className="min-h-screen bg-white text-black">
            <div className="max-w-3xl mx-auto bg-white md:shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <button onClick={() => navigate(-1)} className="text-blue-500 hover:text-blue-700 flex items-center">
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        <p className='text-black font-medium'>Attendance</p>
                    </button>
                    <button onClick={handleOpenModal} className="text-blue-500 hover:text-blue-700 flex items-center">
                        <Plus className="h-5 w-5 mr-1" />
                        New Friends
                    </button>
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
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    {['Member', 'Friend', 'Outstation Member'].map((tab) => (
                        <button
                            key={tab}
                            className={`flex-1 py-2 px-4 text-center ${activeTab === tab
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
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {/* Members Table */}
                <div className="px-4 pb-4">
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
                            {filteredMembers.map((member: any, index: number) => (
                                <tr key={member.id} className="border-t">
                                    <td className="py-2">{index + 1}</td>
                                    <td className="py-2">{member.UserFamilyName}</td>
                                    <td className="py-2">{member.UserName}</td>
                                    <td className="py-2">
                                        <input
                                            type="checkbox"
                                            checked={member.isMarked === "1" || selectedMembers.includes(member.id)}
                                            onChange={() => handleAttendanceChange(member.id)}
                                            className="h-5 w-5 text-blue-600 rounded"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Save Button */}
                <div className="p-4 border-t">
                    <button onClick={handleSubmitAttendance}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
                        Save
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
                            &times;
                        </button>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-wrap -mx-2">
                                <div className="w-full px-2 mb-4">
                                    <label htmlFor="UserName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        required
                                        type="text"
                                        id="UserName"
                                        name="UserName"
                                        value={formData.UserName}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* Family Name field */}
                                <div className="w-1/2 px-2 mb-4">
                                    <label htmlFor="UserFamilyName" className="block text-sm font-medium text-gray-700 mb-1">Family Name</label>
                                    <input
                                        required
                                        type="text"
                                        id="UserFamilyName"
                                        name="UserFamilyName"
                                        value={formData.UserFamilyName}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* Gender field */}
                                <div className="w-1/2 px-2 mb-4">
                                    <label htmlFor="UserGender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        id="UserGender"
                                        name="UserGender"
                                        value={formData.UserGender}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                    </select>
                                </div>

                                {/* Marital Status field */}
                                <div className="w-1/2 px-2 mb-4">
                                    <label htmlFor="UserMaritalStatus" className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                                    <select
                                        id="UserMaritalStatus"
                                        name="UserMaritalStatus"
                                        value={formData.UserMaritalStatus}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                    </select>
                                </div>

                                {/* Date of Birth field */}
                                <div className="w-1/2 px-2 mb-4">
                                    <label htmlFor="UserDOB" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input
                                        required
                                        type="date"
                                        id="UserDOB"
                                        name="UserDOB"
                                        value={formData.UserDOB}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* Phone field */}
                                <div className="w-1/2 px-2 mb-4">
                                    <label htmlFor="UserPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        required
                                        type="text"
                                        id="UserPhone"
                                        name="UserPhone"
                                        value={formData.UserPhone}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>


                                <div className="w-1/2 px-2 mb-4">
                                    <label htmlFor="UserChurchName" className="block text-sm font-medium text-gray-700 mb-1">Church Name</label>
                                    <input
                                        type="text"
                                        required
                                        id="UserChurchName"
                                        name="UserChurchName"
                                        value={formData.UserChurchName}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>


                                {/* Email field (full row) */}
                                <div className="w-full px-2 mb-4">
                                    <label htmlFor="UserEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        id="UserEmail"
                                        required
                                        name="UserEmail"
                                        value={formData.UserEmail}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* Address field */}
                                <div className="w-1/2 px-2 mb-4">
                                    <label htmlFor="UserAddress" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        id="UserAddress"
                                        required
                                        name="UserAddress"
                                        value={formData.UserAddress}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* User Type field */}
                                <div className="w-1/2 px-2 mb-4">
                                    <label htmlFor="UserType" className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                                    <select
                                        id="UserType"
                                        name="UserType"
                                        value={formData.UserType}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="Outstation Member">Outstation Member</option>
                                        <option value="Friend">Friend</option>
                                    </select>
                                </div>

                                {/* Church Name field */}

                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default withAuth(Attendance);
