'use client'

import { useState, useRef } from 'react'
import { ArrowLeft, Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRegister, useChurches } from '../../hooks/useRegister';

export default function Register() {
    const [formData, setFormData] = useState({
        UserName: '',
        UserFamilyName: '',
        churchName: '',
        UserGender: '',
        UserMaritalStatus: '',
        UserDOB: '',
        UserPhone: '',
        UserEmail: '',
        UserAddress: '',
        UserType: '',
        pastoralChurchName: '',
    })
    
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter();

    const { mutate, isLoading, isError, error } = useRegister();
    const { data: churches, isLoading: isChurchLoading, isError: isChurchError } = useChurches();

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Form submitted:', formData)

        // mutate(formData);
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-lg md:shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-800 mr-4"
                        >
                            <ArrowLeft className="h-6 w-6 text-blue-400" />
                        </button>
                        <h2 className="text-xl font-bold">Create a new account</h2>
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
                                id="name"
                                name="name"
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
                                id="familyName"
                                name="familyName"
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
                                    id="gender"
                                    name="gender"
                                    value={formData.UserGender}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                                <select
                                    id="maritalStatus"
                                    name="maritalStatus"
                                    value={formData.UserMaritalStatus}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="divorced">Divorced</option>
                                    <option value="widowed">Widowed</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">D.O.B</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
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
                                id="mobileNumber"
                                name="mobileNumber"
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
                                id="emailId"
                                name="emailId"
                                value={formData.UserEmail}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.UserAddress}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="pastoralChurchName" className="block text-sm font-medium text-gray-700 mb-1">
                                Register as
                            </label>
                            <select
                                id="pastoralChurchName"
                                name="pastoralChurchName"
                                value={formData.UserType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select</option>
                                {isChurchLoading ? (
                                    <option value="">Loading...</option>
                                ) : isChurchError ? (
                                    <option value="">Error loading churches</option>
                                ) : (
                                    churches?.map((church: any) => (
                                        <option key={church.id} value={church.ChurchName}>
                                            {church.ChurchName}
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
                                id="churchName"
                                name="churchName"
                                value={formData.churchName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>

                        {/* {isError && <div className="text-red-600">{error?.message}</div>} */}

                    </form>
                </div>
            </div>
        </div>
    )
}