'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Camera } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { useRegister, useChurches } from '../../hooks/useRegister';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const schema = z.object({
    UserName: z.string().min(1, 'Name is required'),
    UserFamilyName: z.string().min(1, 'Family Name is required'),
    UserGender: z.string().min(1, 'Gender is required'),
    UserMaritalStatus: z.string().min(1, 'Marital Status is required'),
    UserDOB: z.string()
        .refine((val) => !!val, {
            message: 'Date of Birth is required',
        })
        .refine((val) => {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            return regex.test(val);
        }, {
            message: 'Date must be in the format YYYY-MM-DD.',
        })
        .refine((val) => {
            const [year, month, day] = val.split('-').map(Number);
            const currentDate = new Date();
            const maxYear = currentDate.getFullYear();
            const minYear = 1940;

            // Year validation
            return year >= minYear && year <= maxYear;
        }, {
            message: 'Year must be between 1940 and the current year.',
        })
        .refine((val) => {
            const month = Number(val.split('-')[1]);
            // Month validation
            return month >= 1 && month <= 12;
        }, {
            message: 'Month must be between 1 and 12.',
        })
        .refine((val) => {
            const [year, month, day] = val.split('-').map(Number);
            // Day validation
            return day >= 1 && day <= 31;
        }, {
            message: 'Day must be between 1 and 31.',
        })
        .refine((val) => {
            const [year, month, day] = val.split('-').map(Number);
            // Check for valid days in the specified month and year
            const daysInMonth = new Date(year, month, 0).getDate();
            return day <= daysInMonth;
        }, {
            message: 'Invalid date for the specified month and year.',
        }),
    UserPhone: z.string().optional(),
    UserEmail: z.string().email('Email is required'),
    UserAddress: z.string().optional(),
    UserChurchName: z.string().optional(),
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
        UserProfile: null,
    })

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);  // For preview

    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useNavigate();

    const { mutate, isLoading, isError, error } = useRegister();
    const { data: churches, isLoading: isChurchLoading, isError: isChurchError } = useChurches();

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prevData => ({ ...prevData, [name]: value }))
    }

    const handleImageChange = (e: any) => {
        const file: any = e.target.files?.[0];
        if (file) {

            const img = {
                preview: URL.createObjectURL(e.target.files[0]),
                data: e.target.files[0],
            }
            setProfileImage(e.target.files[0])

            // Generate a preview using FileReader (for UI display)
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result as string);
                localStorage.setItem('profileImage', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const { register, setValue, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        const savedFormData = localStorage.getItem('formData');
        if (!savedFormData) {
            localStorage.removeItem('profileImage');  // Remove profileImage if no formData
        }
    }, [])

    useEffect(() => {
        // Check if the form data has been loaded before
        const dataLoadedFlag = localStorage.getItem('dataLoaded');

        if (dataLoadedFlag === null) {
            // Load saved form data from localStorage
            const savedFormData = localStorage.getItem('formData');
            if (savedFormData) {
                const parsedData = JSON.parse(savedFormData);
                setFormData(parsedData);

                // Set default values in the form
                setValue('UserName', parsedData.UserName || '');
                setValue('UserFamilyName', parsedData.UserFamilyName || '');
                setValue('UserDOB', parsedData.UserDOB || '');
                setValue('UserPhone', parsedData.UserPhone || '');
                setValue('UserEmail', parsedData.UserEmail || '');
                setValue('UserAddress', parsedData.UserAddress || '');
                setValue('UserAddress', parsedData.UserAddress || '');
                setValue('UserGender', parsedData.UserGender || '');
                setValue('UserMaritalStatus', parsedData.UserMaritalStatus || '');
                setValue('UserType', parsedData.UserType || '');
                setValue('UserStatus', parsedData.UserStatus || '');
                setValue('UserGroupID', parsedData.UserGroupID || '');
                setValue('UserChurchName', parsedData.UserChurchName || '');

                localStorage.setItem('dataLoaded', 'true');

            }

            const savedImage = localStorage.getItem('profileImage');
            if (savedImage) {
                setProfileImagePreview(savedImage);
            }

        } else {
            // Clear the form data from localStorage after the first refresh
            localStorage.removeItem('formData');
            localStorage.removeItem('dataLoaded');
            localStorage.removeItem('profileImage');
        }
    }, [setValue]);

    const onSubmit = (data: any) => {
        let formData: any = new FormData();

        if (profileImage) {
            formData.append('UserProfile', profileImage);
        } else {
            formData.append('UserProfile', '');
        }

        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        // Debug log for checking the FormData contents
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value); // Should show 'UserProfile' and the image file
        }


        // Call the mutate function from useRegister hook with FormData
        mutate(formData, {
            onSuccess: (data) => {
                localStorage.setItem('UserEmail', data.UserEmail);
                localStorage.setItem('formData', JSON.stringify(data));

                router('/register/set-password');

                console.log('Registration successful:', data);
            },
            onError: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: `${error}`,
                    confirmButtonText: 'OK',
                });
                console.error('Registration failed:', error);
            },
        });
    };


    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


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
                                {profileImagePreview ? (
                                    <img src={profileImagePreview} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
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
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name <span className='text-red-500'>*</span></label>
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
                            <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-1">Family Name <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                id="UserFamilyName"
                                {...register('UserFamilyName')}  // Keep using the register from React Hook Form
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.UserFamilyName && typeof errors.UserFamilyName.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors?.UserFamilyName.message}</p>
                            )}
                        </div>


                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender <span className='text-red-500'>*</span></label>
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
                                <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">Marital Status <span className='text-red-500'>*</span></label>
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
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (YYYY-MM-DD format only)</label>

                            {/* Date input for desktop */}
                            {/* <input
                                type="date"
                                id="UserDOB"
                                defaultValue={formData.UserDOB || ''}
                                {...register('UserDOB', {
                                    validate: (value) => {
                                        const selectedDate = new Date(value);
                                        const minDate = new Date('1900-01-01');
                                        const maxDate = new Date();

                                        if (selectedDate < minDate) {
                                            return 'Date of birth cannot be before 1900.';
                                        }
                                        if (selectedDate > maxDate) {
                                            return 'Date of birth cannot be in the future.';
                                        }
                                        return true;
                                    },
                                })}
                                className="hidden md:block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                max={new Date().toISOString().split('T')[0]}
                                min="1900-01-01"
                            /> */}

                            {/* Text input for mobile */}
                            {/* <input
                                type="text"
                                id="UserDOBText"
                                defaultValue={formData.UserDOB || ''}
                                {...register('UserDOB', {
                                    validate: (value) => {
                                        // Regex pattern to validate date format (YYYY-MM-DD)
                                        const regex = /^\d{4}-\d{2}-\d{2}$/;
                                        if (!regex.test(value)) {
                                            return 'Date must be in the format YYYY-MM-DD.';
                                        }

                                        const [year, month, day] = value.split('-').map(Number);
                                        const currentDate = new Date();
                                        const maxYear = currentDate.getFullYear();
                                        const minYear = 1940;

                                        // Year validation
                                        if (year < minYear || year > maxYear) {
                                            return `Year must be between ${minYear} and ${maxYear}.`;
                                        }

                                        // Month validation
                                        if (month < 1 || month > 12) {
                                            return 'Month must be between 1 and 12.';
                                        }

                                        // Day validation
                                        if (day < 1 || day > 31) {
                                            return 'Day must be between 1 and 31.';
                                        }

                                        // Additional check for days in month (leap year handling can be added)
                                        const daysInMonth = new Date(year, month, 0).getDate();
                                        if (day > daysInMonth) {
                                            return `This month has only ${daysInMonth} days.`;
                                        }

                                        return true;
                                    },
                                })}
                                onInput={(e: any) => {
                                    e.target.value = e.target.value.replace(/[^0-9-]/g, '');
                                }}
                                className="block md:hidden w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="YYYY-MM-DD"
                            /> */}

                            {isMobile ? (

                                <input
                                    type="text"
                                    id="UserDOBText"
                                    defaultValue={formData.UserDOB || ''}
                                    {...register('UserDOB', {
                                        validate: (value) => {
                                            // Regex pattern to validate date format (YYYY-MM-DD)
                                            const regex = /^\d{4}-\d{2}-\d{2}$/;
                                            if (!regex.test(value)) {
                                                return 'Date must be in the format YYYY-MM-DD.';
                                            }

                                            const [year, month, day] = value.split('-').map(Number);
                                            const currentDate = new Date();
                                            const maxYear = currentDate.getFullYear();
                                            const minYear = 1940;

                                            // Year validation
                                            if (year < minYear || year > maxYear) {
                                                return `Year must be between ${minYear} and ${maxYear}.`;
                                            }

                                            // Month validation
                                            if (month < 1 || month > 12) {
                                                return 'Month must be between 1 and 12.';
                                            }

                                            // Day validation
                                            if (day < 1 || day > 31) {
                                                return 'Day must be between 1 and 31.';
                                            }

                                            // Additional check for days in month (leap year handling can be added)
                                            const daysInMonth = new Date(year, month, 0).getDate();
                                            if (day > daysInMonth) {
                                                return `This month has only ${daysInMonth} days.`;
                                            }

                                            return true;
                                        },
                                    })}
                                    onInput={(e: any) => {
                                        e.target.value = e.target.value.replace(/[^0-9-]/g, '');
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="YYYY-MM-DD"
                                />

                            )
                                : (
                                    <input
                                        type="date"
                                        id="UserDOB"
                                        defaultValue={formData.UserDOB || ''}
                                        {...register('UserDOB', {
                                            validate: (value) => {
                                                const selectedDate = new Date(value);
                                                const minDate = new Date('1900-01-01');
                                                const maxDate = new Date();

                                                if (selectedDate < minDate) {
                                                    return 'Date of birth cannot be before 1900.';
                                                }
                                                if (selectedDate > maxDate) {
                                                    return 'Date of birth cannot be in the future.';
                                                }
                                                return true;
                                            },
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        max={new Date().toISOString().split('T')[0]}
                                        min="1900-01-01"
                                    />
                                )}

                            {/* Error messages */}
                            {errors.UserDOB && typeof errors.UserDOB.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors.UserDOB.message}</p>
                            )}
                            {errors.UserDOBText && typeof errors.UserDOBText.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors.UserDOBText.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <input
                                type="tel"
                                id="UserPhone"
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = e.target.value; // Remove non-digit characters
                                    if (value.length <= 500) { // Allow max 10 digits
                                        e.target.value = value;
                                    } else {
                                        e.target.value = value.slice(0, 10); // Trim to 10 digits
                                    }
                                }}
                                {...register('UserPhone')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.UserPhone && typeof errors.UserPhone.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors?.UserPhone.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-1">Email ID <span className='text-red-500'>*</span></label>
                            <input
                                type="email"
                                id="UserEmail"
                                defaultValue={formData.UserEmail || ''}
                                {...register('UserEmail', {
                                    required: 'Email is required.',
                                    validate: value => {
                                        if (/\s/.test(value)) {
                                            return 'Email cannot contain spaces.';
                                        }
                                        return true; // Return true if validation passes
                                    }
                                })}
                                onKeyPress={(e) => {
                                    if (e.key === ' ') {
                                        e.preventDefault(); // Prevent space character
                                    }
                                }}
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
                                Register as <span className='text-red-500'>*</span>
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