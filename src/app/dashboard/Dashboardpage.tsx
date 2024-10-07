import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import withAuth from '../authCheck';
import { DesktopHeader } from '../../components/partials/desktopHeader';
import { MobileHeader } from '../../components/partials/mobileHeader';
import { useDashboard } from '../../hooks/useDashboard';
import { getRights } from '../../utils/api';
import Lottie  from 'lottie-react';
import emptyAnimation from '../../animation/empty.json';

const ChurchDemographics = () => {
    const [activeTab, setActiveTab] = useState('Home');
    const [accessRights, setAccessRights] = useState(null);
    const navigate = useNavigate();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    const userData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;

    const { data: isData, isLoading, error } = useDashboard(token);

    useEffect(() => {
        const fetchAccessRights = async () => {
            console.log("fetched")
            try {
                if (token && userData) {
                    const data = await getRights(token);

                    if (data) {
                        const userRights = data.find((right: any) => right.user_type === userData.user.UserType);
                        if (userRights) {
                            setAccessRights(userRights);

                            // Check if the user has access to the dashboard
                            if (userRights.dashboard === '0') {
                                // Redirect if no access to the dashboard
                                if (userRights.report === '1') {
                                    navigate('/dashboard/reports');
                                } else if (userRights.events === '1') {
                                    navigate('/dashboard/events');
                                } else {
                                    navigate('/login');  // Redirect to login if no access to any features
                                }
                            }
                        }
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }


    // if (!accessRights) {
    //     return <div>No access rights found</div>;
    // }

    // ApexCharts options for donut chart
    const chartOptions: any = {
        chart: {
            type: 'donut',
        },
        labels: isData?.data?.map((item: any) => item.name) || [],
        colors: isData?.data?.map((item: any) => item.color) || [],
        legend: {
            show: false,
            position: 'bottom',
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: '100%',
                    },
                },
            },
        ],
    };

    const chartSeries = isData?.data?.map((item: any) => item.value) || [];

    console.log("chat", chartSeries)
    return (
        <div className="min-h-screen bg-white text-black">
            {/* Mobile Header */}
            {/* <header className="bg-white p-4 flex items-center justify-between md:hidden">
                <div className="flex items-center">
                    <img src="/logo.png" width={80} height={80} alt="Church Logo" className="mr-2" />
                    <span className="font-bold text-lg">True Jesus Church</span>
                </div>
            </header> */}

            {/* Desktop Header */}
            <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="container mx-auto p-4 mb-[50px]">
                <h1 className="text-md font-medium mb-4">Membership Demographic</h1>

                {/* Donut Chart */}
                <div className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center">
                    {/* Donut Chart */}
                    <div className="w-1/10 md:w-1/4 ml-[-20px]">
                        {chartSeries.length > 0 && chartSeries.some((value: number) => value !== 0) ? (
                            <Chart
                                options={chartOptions}
                                series={chartSeries}
                                type="donut"
                                width="100%"
                                height="300"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full mt-4">
                                <Lottie animationData={emptyAnimation} loop={true} style={{ width: '100%', height: '300px' }} />
                                {/* <div className="text-center mt-2">Data is empty</div> */}
                            </div>)}
                    </div>


                    <div className="w-1/2 md:w-1/3">
                        <ul className="space-y-2">
                            {isData?.data.map((item: any, index: number) => (
                                <li key={index} className="flex justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span
                                            className="inline-block w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-gray-600">{item.name}</span>
                                    </div>
                                    <span className="text-gray-600">{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <h2 className="text-md font-medium mb-2">Total Values</h2>
                <div className="bg-[#E1E1E1] rounded-lg shadow p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        {isData?.totalValues.map((item: any, index: number) => (
                            <Link to={`/dashboard/report-users/${item.name}`} key={index}>
                                <div className="md:flex">
                                    <span className="text-gray-600">{item.label}</span>
                                    <br />
                                    <span className="text-[#0065FF] md:ml-[10px] font-semibold">{item.value}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <h2 className="text-md font-medium mb-2">Average Attendance</h2>
                <div className="bg-[#E1E1E1] rounded-lg shadow p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        {isData?.averageAttendance.map((item: any, index: number) => (
                            <div key={index} className="md:flex">
                                <span className="text-gray-600">{item.day}</span>
                                <br />
                                <span className="text-[#0065FF] font-semibold md:ml-[10px]">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Mobile Navigation */}
            <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Floating Action Button */}
            <Link to="/dashboard/member" className="fixed bottom-20 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
            </Link>
        </div>
    );
};

export default withAuth(ChurchDemographics);
