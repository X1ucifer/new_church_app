'use client'

import { useState, useRef } from 'react'
import { ArrowLeft, Camera } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { useRegister, useChurches } from '../../hooks/useRegister';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const schema = z.object({
    UserName: z.string().min(1, 'Name is required'),
    UserFamilyName: z.string().min(1, 'Family Name is required'),
    UserGender: z.string().min(1, 'Gender is required'),
    UserMaritalStatus: z.string().min(1, 'Marital Status is required'),
    UserDOB: z.string().min(1, 'Date of Birth is required'),
    UserPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
    UserEmail: z.string().email('Invalid email address'),
    UserAddress: z.string().min(1, 'Address is required'),
    UserChurchName: z.string().min(1, 'Pastoral Church name is required'),
    UserType: z.string().min(1, 'User Type is required'),
});

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
    const router = useNavigate();

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

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema),
    });


    const onSubmit = (data: any) => {
        const formDataWithImage = { ...data, profileImage };
    
        // Call the mutate function from useRegister hook
        mutate(formDataWithImage, {
          onSuccess: (data) => {
            localStorage.setItem('UserEmail', data.UserEmail);
            router('/register/set-password');

            console.log('Registration successful:', data);
          },
          onError: (error) => {
            console.error('Registration failed:', error);
          },
        });
      };
    

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-lg md:shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => router(-1)}
                            className="text-gray-600 hover:text-gray-800 mr-4"
                        >
                            <ArrowLeft className="h-6 w-6 text-blue-400" />
                        </button>
                        <h2 className="text-xl font-bold">Create a new account</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                {...register('UserName')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.UserName && typeof errors.UserName.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors?.UserName.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-1">Family Name</label>
                            <input
                                type="text"
                                id="UserFamilyName"
                                {...register('UserFamilyName')}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.UserFamilyName && typeof errors.UserFamilyName.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors?.UserFamilyName.message}</p>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    id="UserGender"
                                    {...register('UserGender')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.UserGender && typeof errors.UserGender.message === 'string' && (
                                    <p className="text-red-500 text-sm">{errors?.UserGender.message}</p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                                <select
                                    id="UserMaritalStatus"
                                    {...register('UserMaritalStatus')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                                {errors.UserMaritalStatus && typeof errors.UserMaritalStatus.message === 'string' && (
                                    <p className="text-red-500 text-sm">{errors?.UserMaritalStatus.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">D.O.B</label>
                            <input
                                type="date"
                                id="UserDOB"
                                {...register('UserDOB')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                max={new Date().toISOString().split('T')[0]}
                            />
                            {errors.UserDOB && typeof errors.UserDOB.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors?.UserDOB.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <input
                                type="tel"
                                id="UserPhone"
                                {...register('UserPhone')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.UserPhone && typeof errors.UserPhone.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors?.UserPhone.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                            <input
                                type="email"
                                id="UserEmail"
                                {...register('UserEmail')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.UserEmail && typeof errors.UserEmail.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors?.UserEmail.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                id="UserAddress"
                                {...register('UserAddress')}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                            {errors.UserAddress && typeof errors.UserAddress.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors?.UserAddress.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="pastoralChurchName" className="block text-sm font-medium text-gray-700 mb-1">
                                Register as
                            </label>
                            <select
                                id="UserType"
                                {...register('UserType')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select</option>
                                <option value="Pastor">Pastor</option>
                                <option value="Exco">Exco</option>
                                {/* <option value="Member">Member</option> */}
                            </select>
                            {errors.UserType && typeof errors.UserType.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors?.UserType.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="churchName" className="block text-sm font-medium text-gray-700 mb-1">Pastoral Church Name
                            </label>
                            <input
                                type="text"
                                id="UserChurchName"
                                {...register('UserChurchName')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.UserChurchName && typeof errors.UserChurchName.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors?.UserChurchName.message}</p>
                            )}
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