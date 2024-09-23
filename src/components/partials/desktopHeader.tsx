import * as React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { getRights } from '../../utils/api';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useNavigation

export interface IAppProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function DesktopHeader({ activeTab, setActiveTab }: IAppProps) {
    const [accessRights, setAccessRights] = React.useState<any>(null);
    const [userType, setUserType] = React.useState<string>('');
    const navigate = useNavigate(); 

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/'); 
    };

    React.useEffect(() => {
        const fetchAccessRights = async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
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
    }, [navigate]);

    if (!accessRights) return null;

    return (
        <header className="bg-white p-4 hidden md:flex items-center justify-between">
            <div className="flex items-center">
                <img src="/logo.png" width={40} height={40} alt="Church Logo" className="mr-2" />
                <span className="font-bold text-lg">True Jesus Church</span>
            </div>
            <nav>
                <ul className="flex space-x-4">
                    {accessRights.dashboard === '1' && (
                        <li>
                            <Link to="/dashboard"> {/* Change href to to */}
                                <button
                                    onClick={() => setActiveTab('Home')}
                                    className={`${activeTab === 'Home' ? 'text-blue-600' : 'text-gray-600'} hover:text-gray-900`}
                                >
                                    Home
                                </button>
                            </Link>
                        </li>
                    )}
                    {accessRights.report === '1' && (
                        <li>
                            <Link to="/dashboard/reports"> {/* Change href to to */}
                                <button
                                    onClick={() => setActiveTab('Report')}
                                    className={`${activeTab === 'Report' ? 'text-blue-600' : 'text-gray-600'} hover:text-gray-900`}
                                >
                                    Report
                                </button>
                            </Link>
                        </li>
                    )}
                    {accessRights.events === '1' && (
                        <li>
                            <Link to="/dashboard/events"> {/* Change href to to */}
                                <button
                                    onClick={() => setActiveTab('Events')}
                                    className={`${activeTab === 'Events' ? 'text-blue-600' : 'text-gray-600'} hover:text-gray-900`}
                                >
                                    Events
                                </button>
                            </Link>
                        </li>
                    )}
                    {accessRights.settings === '1' ? (
                        <li>
                            <Link to="/dashboard/account"> {/* Change href to to */}
                                <button
                                    onClick={() => setActiveTab('Account')}
                                    className={`${activeTab === 'Account' ? 'text-blue-600' : 'text-gray-600'} hover:text-gray-900`}
                                >
                                    Account
                                </button>
                            </Link>
                        </li>
                    ) : (
                        <>
                            <li>
                                <button
                                    onClick={logout}
                                    className={`${activeTab === 'Account' ? 'text-blue-600' : 'text-gray-600'} hover:text-gray-900`}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    )}


                </ul>
            </nav>
        </header>
    );
}
