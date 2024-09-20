import React from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import withAuth from '../../../../app/authCheck'; // Replace with your actual auth HOC path
import { useMember, useDeleteMember } from '../../../../hooks/useMembersData'; // Adjust the hook import paths as needed
import { toast } from 'react-toastify';

function UserProfile() {
    const navigate = useNavigate();
    const { id } = useParams(); // Access the route params
    const token = localStorage.getItem('token') || '';
    const userId: any = id;

    const { data: user, isLoading, error } = useMember(token, userId);
    const { mutate: deleteMember } = useDeleteMember();

    const handleEdit = () => {
        const userIdString = String(userId);
        navigate(`/dashboard/member/edit-member/${userIdString}`);
    };

    const handleDelete = () => {
        toast(
            <div>
                <p>Are you sure you want to delete this account?</p>
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        onClick={() => {
                            if (userId) {
                                deleteMember({ id: Number(userId), token });
                                toast.success('Account deleted successfully.');
                                navigate('/dashboard'); // Redirect after deletion
                            }
                            toast.dismiss(); // Close the toast
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss()} // Close the toast
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        No
                    </button>
                </div>
            </div>,
            {
                position: 'top-center',
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                style: {
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="max-w-3xl mx-auto bg-white md:shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-4">
                    <button
                        onClick={() => navigate(-1)} // Use navigate(-1) to go back in React Router
                        className="text-gray-600 hover:text-gray-800 mr-4"
                    >
                        <ArrowLeft className="h-6 w-6 text-blue-400" />
                    </button>
                  
                </div>

                {/* Profile Content */}
                <div className="p-4">
                    {/* Profile Picture and Name */}
                    <div className="flex justify-start items-center mb-6">
                        <img src="/profile.png" width={100} height={100} alt="Logo" className="w-24 h-24 rounded-full object-cover mb-2" />
                        <h1 className="ml-[20px] text-2xl font-bold">
                            {user?.UserName} <br />
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                {user?.status || "Active"}
                            </span>
                        </h1>
                    </div>

                    {/* User Information */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {user && Object.entries(user).map(([key, value]) => {
                            if (key !== 'UserName' && key !== 'UserChurchID' && key !== 'id' && key !== 'UserProfile' && key !== 'UserEmailVerified' && key !== 'UserGroupID' && key !== 'UserType' && key !== 'UserAddress') {
                                return (
                                    <div key={key}>
                                        <p className="text-gray-500 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                        <p className="font-semibold">{value as any}</p>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>

                    {/* Address */}
                    <div className="mb-6">
                        <p className="text-gray-500 text-sm">Address</p>
                        <p className="font-semibold">{user?.UserAddress}</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex sm:flex-row gap-4 mb-4 mt-4">
                        <button
                            onClick={handleDelete}
                            className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                        >
                            Delete Account
                        </button>
                        <button
                            onClick={handleEdit}
                            className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(UserProfile);
