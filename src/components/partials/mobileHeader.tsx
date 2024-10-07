import React from 'react';
import { Home, FileText, Calendar, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Use React Router for navigation
import { updateRights, getRights } from '../../utils/api'; // Adjust the import path as needed
import Skeleton from 'react-loading-skeleton';
import Swal from 'sweetalert2';

export interface IAppProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function MobileHeader({ activeTab, setActiveTab }: IAppProps) {
    const [accessRights, setAccessRights] = React.useState<any>(null);
    const [userType, setUserType] = React.useState<string>('');
    const navigate = useNavigate();

    const logout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out from your account.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log out!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Perform logout
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/'); // Redirect to the home page or login page
                Swal.fire(
                    'Logged Out!',
                    'You have been logged out successfully.',
                    'success'
                );
            }
        });
    };

    React.useEffect(() => {
        const fetchAccessRights = async () => {
            try {
                const token = localStorage.getItem('token') || '';
                const userData = localStorage.getItem('user');
                const parsedData = userData ? JSON.parse(userData) : null;

                if (token && parsedData) {
                    const data = await getRights(token);

                    if (data) {
                        setUserType(parsedData.user.UserType);
                        const userRights = data.find((right: any) => right.user_type === parsedData.user.UserType);
                        if (userRights) {
                            setAccessRights(userRights);
                        }
                    } else {
                        console.warn('No access rights data found');
                    }
                } else {
                    console.warn('No token or user data found');
                }
            } catch (error) {
                console.error('Failed to fetch access rights:', error);
            }
        };

        fetchAccessRights();
    }, []);

    const skeletonRows = Array(4).fill(null);

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden ">
            <ul className="flex justify-around p-2">
                {/* Render skeleton if accessRights is not yet loaded */}
                {!accessRights ? (
                    skeletonRows.map((_, index) => (
                        <li key={index}>
                            <div className="flex flex-col items-center">
                                <Skeleton circle height={24} width={24} />
                                <Skeleton width={40} height={10} className="mt-2" />
                            </div>
                        </li>
                    ))
                ) : (
                    <>
                        {accessRights.dashboard === '1' && (
                            <li>
                                <Link to="/dashboard">
                                    <button
                                        className={`flex flex-col items-center ${activeTab === 'Home' ? 'text-blue-600' : 'text-gray-600'}`}
                                        onClick={() => setActiveTab('Home')}
                                    >
                                        <Home className="h-6 w-6" />
                                        <span className="text-xs">Home</span>
                                    </button>
                                </Link>
                            </li>
                        )}
                        {accessRights.report === '1' && (
                            <li>
                                <Link to="/dashboard/reports">
                                    <button
                                        className={`flex flex-col items-center ${activeTab === 'Report' ? 'text-blue-600' : 'text-gray-600'}`}
                                        onClick={() => setActiveTab('Report')}
                                    >
                                        <FileText className="h-6 w-6" />
                                        <span className="text-xs">Report</span>
                                    </button>
                                </Link>
                            </li>
                        )}
                        {accessRights.events === '1' && (
                            <li>
                                <Link to="/dashboard/events">
                                    <button
                                        className={`flex flex-col items-center ${activeTab === 'Events' ? 'text-blue-600' : 'text-gray-600'}`}
                                        onClick={() => setActiveTab('Events')}
                                    >
                                        <Calendar className="h-6 w-6" />
                                        <span className="text-xs">Events</span>
                                    </button>
                                </Link>
                            </li>
                        )}
                        {accessRights.settings === '1' ? (
                            <li>
                                <Link to="/dashboard/account">
                                    <button
                                        className={`flex flex-col items-center ${activeTab === 'Account' ? 'text-blue-600' : 'text-gray-600'}`}
                                        onClick={() => setActiveTab('Account')}
                                    >
                                        <User className="h-6 w-6" />
                                        <span className="text-xs">Account</span>
                                    </button>
                                </Link>
                            </li>
                        )
                            : (
                                <>
                                    <button
                                        className={`flex flex-col items-center ${activeTab === 'Account' ? 'text-blue-600' : 'text-gray-600'}`}
                                        onClick={logout}
                                    >
                                        <LogOut className="h-6 w-6" />
                                        <span className="text-xs">Logout</span>
                                    </button>
                                </>
                            )
                        }
                    </>
                )}
            </ul>
        </nav>
    );
}
