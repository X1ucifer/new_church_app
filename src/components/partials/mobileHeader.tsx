import * as React from 'react';
import { Home, FileText, Calendar, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 
import { updateRights, getRights } from '../../utils/api';

export interface IAppProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function MobileHeader({ activeTab, setActiveTab }: IAppProps) {
    const [accessRights, setAccessRights] = React.useState<any>(null);
    const [userType, setUserType] = React.useState<string>('');
    const navigate = useNavigate(); // Use useNavigate from react-router-dom

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

    // If accessRights is null, you can render a loader or nothing
    if (!accessRights) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden ">
            <ul className="flex justify-around p-2">
                {accessRights.dashboard === '1' && (
                    <li>
                        <Link to="/dashboard"> {/* Change href to to */}
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
                        <Link to="/dashboard/reports"> {/* Change href to to */}
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
                        <Link to="/dashboard/events"> {/* Change href to to */}
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
                {accessRights.settings === '1' && (
                    <li>
                        <Link to="/dashboard/account"> {/* Change href to to */}
                            <button
                                className={`flex flex-col items-center ${activeTab === 'Account' ? 'text-blue-600' : 'text-gray-600'}`}
                                onClick={() => setActiveTab('Account')}
                            >
                                <User className="h-6 w-6" />
                                <span className="text-xs">Account</span>
                            </button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
