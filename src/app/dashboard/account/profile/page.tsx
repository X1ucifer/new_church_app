import React, { useEffect, useState } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import withAuth from '../../../../app/authCheck'; // Replace with your actual auth HOC path
import { useMember, useDeleteMember } from '../../../../hooks/useMembersData'; // Adjust the hook import paths as needed
import { toast } from 'react-toastify';
import { DesktopHeader } from '../../../../components/partials/desktopHeader';
import Swal from 'sweetalert2';

function UserProfile() {
    const location = useLocation();
    const initialTab = location.state?.activeTab || 'Account';

    const [userType, setUserType] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [activeTab, setActiveTab] = useState(initialTab);
    const navigate = useNavigate();
    const { id } = useParams(); // Access the route params
    const token = localStorage.getItem('token') || '';
    const userId: any = id;

    const { data: user, isLoading, error } = useMember(token, userId);
    const { mutate: deleteMember } = useDeleteMember();

    const handleEdit = () => {
        const userIdString = String(userId);
        navigate(`/dashboard/member/edit-member/${userIdString}`, {
            state: { from: window.location.pathname } // Pass the current profile route
        });
    };

    useEffect(() => {
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') || '' : '';
        const parsedData = userData ? JSON.parse(userData) : null;
        const userType = parsedData?.user.UserType;
        setCurrentUserId(parsedData?.user.id)
        setUserType(userType);
    }, []);


    const handleDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this account? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                if (userId) {
                    deleteMember({ id: Number(userId), token });
                    Swal.fire('Deleted!', 'The account has been deleted.', 'success').then(() => {
                        const previousRoute = location.state?.from;
                        if (previousRoute && previousRoute.includes('/dashboard/member/edit-member')) {
                            navigate('/dashboard/account', { replace: true }); // Redirect to members list
                        } else if (previousRoute) {
                            navigate(previousRoute); // Navigate back to the previous page
                        } else {
                            navigate('/dashboard/account', { replace: true }); // Default redirect
                        }
                    });
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'The account is safe!', 'info');
            }
        });
    };

    return (
        <>
            <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />

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
                            {/* <img src={user?.UserProfile} width={100} height={100} alt="Logo" className="w-24 h-24 rounded-full object-cover mb-2" /> */}
                            {user?.UserProfile ? (
                                <img
                                    src={user.UserProfile}
                                    width={100}
                                    height={100}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />

                            ) : (
                                <img
                                    src="/user_avatar.jpg"
                                    width={100}
                                    height={100}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                // <div className="w-24 h-24 flex items-center justify-center bg-gray-500 rounded-full">
                                //     <span className="text-4xl font-bold text-white">{user?.UserName?.charAt(0).toUpperCase()}</span>
                                // </div>
                            )}
                            <h1 className="ml-[20px] text-2xl font-bold">
                                <span className="block max-w-[400px] break-words">
                                    {user?.UserName}
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs text-white ${user?.UserStatus === "Active"
                                        ? "bg-green-500"
                                        : user?.UserStatus === "Inactive"
                                            ? "bg-gray-500"
                                            : user?.UserStatus === "Lost"
                                                ? "bg-red-500"
                                                : user?.UserStatus === "NeedVisiting"
                                                    ? "bg-blue-500"
                                                    : user?.UserStatus === "NeedAttention"
                                                        ? "bg-yellow-500"
                                                        : "bg-green-500"
                                        }`}
                                >
                                    {user?.UserStatus || "Active"}
                                </span>

                            </h1>
                        </div>

                        {/* User Information */}
                        {/* <div className="grid grid-cols-2 gap-4 mb-6">
                            {user && Object.entries(user).map(([key, value]) => {
                                // Check for keys to exclude from rendering
                                if (key !== 'UserName' && key !== 'UserChurchID' && key !== 'id' && key !== 'UserProfile' && key !== 'UserEmailVerified' && key !== 'UserGroupID' && key !== 'UserType' && key !== 'UserAddress') {
                                    // Set default value for UserStatus if value is null or undefined
                                    const displayValue = key === 'UserStatus' && (value === null || value === undefined) ? 'Active' : value;

                                    return (
                                        <div key={key}>
                                            <p className="text-gray-500 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                            {key === 'UserPhone' && typeof displayValue === 'string' && displayValue.length > 15 ? (
                                                <>
                                                    <p className="font-semibold">{displayValue.slice(0, 15)}</p>
                                                    <p className="font-semibold">{displayValue.slice(11)}</p>
                                                </>
                                            ) : (
                                                <p className="font-semibold">{displayValue as any}</p>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div> */}

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {user && Object.entries(user).map(([key, value]) => {
                                // Check for keys to exclude from rendering
                                if (key !== 'UserName' && key !== 'UserChurchID' && key !== 'id' && key !== 'UserProfile' && key !== 'UserEmailVerified' && key !== 'UserGroupID' && key !== 'UserType' && key !== 'UserAddress') {

                                    // Set default value for UserStatus if value is null or undefined
                                    const displayValue = key === 'UserStatus' && (value === null || value === undefined) ? 'Active' : value;

                                    // Function to split the text into chunks of 15 characters
                                    const splitIntoChunks = (text: string, chunkSize: number) => {
                                        const chunks = [];
                                        for (let i = 0; i < text.length; i += chunkSize) {
                                            chunks.push(text.slice(i, i + chunkSize));
                                        }
                                        return chunks;
                                    };

                                    return (
                                        <div key={key}>
                                            <p className="text-gray-500 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>

                                            {/* Handling UserPhone and UserFamilyName if longer than 15 characters */}
                                            {(key === 'UserPhone' || key === 'UserFamilyName') && typeof displayValue === 'string' && displayValue.length > 15 ? (
                                                <>
                                                    {splitIntoChunks(displayValue, 15).map((chunk, index) => (
                                                        <p key={index} className="font-semibold">{chunk}</p>
                                                    ))}
                                                </>
                                            ) : (
                                                <p className="font-semibold">{displayValue as any}</p>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>



                        {/* Address */}
                        <div className="mb-6">
                            <p className="text-gray-500 text-sm">Address</p>
                            {user?.UserAddress ? (
                                user.UserAddress
                                    .split('\r') // Split only by carriage return
                                    .map((line: string, index: number) => (
                                        <p key={index} className="font-semibold">{line.trim()}</p>
                                    ))
                            ) : (
                                <p className="font-semibold">No address provided</p>
                            )}
                        </div>
                        {/* Buttons */}

                        <div className="flex sm:flex-row gap-4 mb-4 mt-4">
                            {userType === "Admin" && user?.id !== currentUserId && ( // Check if user is Admin and not viewing their own account
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                                >
                                    Delete Account
                                </button>
                            )}


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
        </>

    );
}

export default withAuth(UserProfile);
