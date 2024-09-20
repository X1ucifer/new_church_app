'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useGroups, useRegister } from '@/hooks/useRegister'
import Swal from 'sweetalert2';
import { useEditMember, useMember } from '@/hooks/useMembersData'

export default function UpdateMember({ params }: any) {
    const [formData, setFormData] = useState({
        UserName: '',
        UserFamilyName: '',
        UserGender: '',
        UserMaritalStatus: '',
        UserDOB: '',
        UserPhone: '',
        UserEmail: '',
        UserAddress: '',
        UserType: '',
        UserChurchName: '',
        UserGroupID: '',
    })

    const [profileImage, setProfileImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter();

    // const params = useParams()
    const id: any = params.slug

    console.log(id)

    const { mutate: editMember, isLoading: Loading, error: Error } = useEditMember();

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prevData => ({ ...prevData, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }


    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

    const { data: groups, isLoading, error } = useGroups(token);

    const { data: member, isLoading: editLoading, error: editError } = useMember(token, id);



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await editMember({ token, id, data: formData }, {
                onSuccess() {
                    router.push(`/dashboard/account/profile/${id}`)
                }
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update member details. Please try again.',
                confirmButtonText: 'OK',
            });
        }
    };


    useEffect(() => {
        if (member) {
            setFormData({
                UserName: member.UserName || '',
                UserFamilyName: member.UserFamilyName || '',
                UserGender: member.UserGender || '',
                UserMaritalStatus: member.UserMaritalStatus || '',
                UserDOB: member.UserDOB || '',
                UserPhone: member.UserPhone || '',
                UserEmail: member.UserEmail || '',
                UserAddress: member.UserAddress || '',
                UserType: member.UserType || '',
                UserChurchName: member.UserChurchName || '',
                UserGroupID: member.UserGroupID || '',
            });
            // Set profile image if available
            if (member.profileImage) {
                setProfileImage(member.profileImage);
            }
        }
    }, [member]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-black">
            <div className="w-full max-w-lg bg-white rounded-lg md:shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-800 mr-4"
                        >
                            <ArrowLeft className="h-6 w-6 text-blue-400" />
                        </button>
                        <h2 className="text-xl font-bold">Edit Member</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex md:justify-center mb-6">
                            <div className="relative">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                        <Camera className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 text-white"
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                id="UserName"
                                name="UserName"
                                value={formData.UserName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-1">Family Name</label>
                            <input
                                type="text"
                                id="UserFamilyName"
                                name="UserFamilyName"
                                value={formData.UserFamilyName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    id="UserGender"
                                    name="UserGender"
                                    value={formData.UserGender}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                                <select
                                    id="UserMaritalStatus"
                                    name="UserMaritalStatus"
                                    value={formData.UserMaritalStatus}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">D.O.B</label>
                            <input
                                type="date"
                                id="UserDOB"
                                name="UserDOB"
                                value={formData.UserDOB}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <input
                                type="tel"
                                id="UserPhone"
                                name="UserPhone"
                                value={formData.UserPhone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                            <input
                                type="email"
                                id="UserEmail"
                                name="UserEmail"
                                value={formData.UserEmail}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                id="UserAddress"
                                name="UserAddress"
                                value={formData.UserAddress}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="pastoralChurchName" className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                id="UserType"
                                name="UserType"
                                value={formData.UserType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select</option>
                                <option value="Admin">Admin</option>
                                <option value="Pastor">Pastor</option>
                                <option value="Exco">Exco</option>
                                <option value="Member">Member</option>
                                <option value="Friend">Friend</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="pastoralChurchName" className="block text-sm font-medium text-gray-700 mb-1">
                                Group
                            </label>
                            <select
                                id="UserType"
                                name="UserGroupID"
                                value={formData.UserGroupID}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select Group</option>
                                {isLoading ? (
                                    <option>Loading groups...</option>
                                ) : error ? (
                                    <option>Error loading groups</option>
                                ) : (
                                    groups?.map((group: any) => (
                                        <option key={group.id} value={group.id}>
                                            {group.GroupName}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>


                        <div>
                            <label htmlFor="churchName" className="block text-sm font-medium text-gray-700 mb-1">Pastoral Church Name
                            </label>
                            <input
                                type="text"
                                id="UserChurchName"
                                name="UserChurchName"
                                value={formData.UserChurchName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {Loading ? 'Updating...' : 'Update'}
                        </button>

                        {/* {error && <p className="error">{error.message}</p>} */}

                    </form>
                </div>
            </div>
        </div>
    )
}