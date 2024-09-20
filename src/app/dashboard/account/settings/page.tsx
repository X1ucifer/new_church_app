'use client'

import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { updateRights, getRights } from '@/utils/api';
import Swal from 'sweetalert2';

interface AccessRight {
    id: number
    name: string
    localPastor: boolean
    localExec: boolean
}

const initialAccessRights: AccessRight[] = [
    { id: 1, name: 'Dashboard', localPastor: false, localExec: false },
    { id: 2, name: 'Report', localPastor: false, localExec: false },
    { id: 3, name: 'Events', localPastor: false, localExec: false },
    { id: 4, name: 'Settings', localPastor: false, localExec: false },
]

export default function UsageRights() {
    const [accessRights, setAccessRights] = useState<AccessRight[]>(initialAccessRights)
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchRights = async () => {
            try {
                const token = localStorage.getItem('token');

                const userData = localStorage.getItem('user');

                const parsedData = userData ? JSON.parse(userData) : null;

                const user_type = parsedData?.user?.UserType;

                if (!token || !user_type) {
                    throw new Error('User authentication information is missing');
                }

                // Fetch rights from API
                const rights = await getRights(token);

                const relevantUserTypes = ["Pastor", "Exco"];

                const userRights = rights.filter((right: any) => relevantUserTypes.includes(right.user_type));

                console.log("d", userRights);

                // Create a dictionary to easily access user rights by type
                const rightsByType = userRights.reduce((acc: any, right: any) => {
                    acc[right.user_type] = right;
                    return acc;
                }, {});

                if (Object.keys(rightsByType).length > 0) {
                    setAccessRights([
                        { id: 1, name: 'Dashboard', localPastor: rightsByType['Pastor']?.dashboard === '1', localExec: rightsByType['Exco']?.dashboard === '1' },
                        { id: 2, name: 'Report', localPastor: rightsByType['Pastor']?.report === '1', localExec: rightsByType['Exco']?.report === '1' },
                        { id: 3, name: 'Events', localPastor: rightsByType['Pastor']?.events === '1', localExec: rightsByType['Exco']?.events === '1' },
                        { id: 4, name: 'Settings', localPastor: rightsByType['Pastor']?.settings === '1', localExec: rightsByType['Exco']?.settings === '1' },
                    ]);
                } else {
                    console.warn('No rights found for relevant user types');
                }
            } catch (error: any) {
                console.error(error.message || 'Failed to fetch user rights.');
            }
        };

        fetchRights();
    }, []);

    const handleCheckboxChange = (id: number, role: 'localPastor' | 'localExec') => {
        setAccessRights(prevRights =>
            prevRights.map(right =>
                right.id === id ? { ...right, [role]: !right[role] } : right
            )
        )
    }

    const handleSave = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            const parsedData = userData ? JSON.parse(userData) : null;

            if (!token || !parsedData) {
                throw new Error('User authentication information is missing');
            }

            // Determine if checkboxes for localPastor or localExec are selected
            const hasLocalPastor = accessRights.some(right => right.localPastor);
            const hasLocalExec = accessRights.some(right => right.localExec);

            // Prepare updated rights for both user types
            const updatedRightsPastor = {
                dashboard: accessRights.find(right => right.name === 'Dashboard')?.localPastor || false,
                report: accessRights.find(right => right.name === 'Report')?.localPastor || false,
                events: accessRights.find(right => right.name === 'Events')?.localPastor || false,
                settings: accessRights.find(right => right.name === 'Settings')?.localPastor || false,
            };

            const updatedRightsExec = {
                dashboard: accessRights.find(right => right.name === 'Dashboard')?.localExec || false,
                report: accessRights.find(right => right.name === 'Report')?.localExec || false,
                events: accessRights.find(right => right.name === 'Events')?.localExec || false,
                settings: accessRights.find(right => right.name === 'Settings')?.localExec || false,
            };

            if (hasLocalPastor) {
                await updateRights(token, 'Pastor', updatedRightsPastor);
            }

            if (hasLocalExec) {
                await updateRights(token, 'Exco', updatedRightsExec);
            }

            Swal.fire({
                icon: 'success',
                title: 'Successful',
                text: 'Rights saved!',
                confirmButtonText: 'OK',
            });
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to save changes. Please try again.',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-white text-black">
            <div className="max-w-2xl mx-auto bg-white md:shadow-lg">
                {/* Header */}
                <div className="flex items-center p-4 border-b">
                    <button onClick={() => router.back()} className="text-blue-500 hover:text-blue-700 mr-4">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-medium">Settings</h1>
                </div>

                {/* Main Content */}
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Usage Rights</h2>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border p-2 text-left">#</th>
                                    <th className="border p-2 text-left">Access Rights</th>
                                    <th className="border p-2 text-center">Local Pastor</th>
                                    <th className="border p-2 text-center">Local Exec</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accessRights.map((right) => (
                                    <tr key={right.id}>
                                        <td className="border p-2">{right.id}</td>
                                        <td className="border p-2">{right.name}</td>
                                        <td className="border p-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={right.localPastor}
                                                onChange={() => handleCheckboxChange(right.id, 'localPastor')}
                                                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="border p-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={right.localExec}
                                                onChange={() => handleCheckboxChange(right.id, 'localExec')}
                                                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Edit Profile Button */}
                    <button onClick={handleSave} disabled={loading}

                        className="w-full bg-blue-500 text-white py-2 rounded-md mt-6 hover:bg-blue-600 transition-colors duration-300">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}