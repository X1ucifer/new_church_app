import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Camera } from 'lucide-react'
// import { useRouter } from 'next/navigation'
import { useNavigate } from 'react-router-dom'
import { useGroups, useRegister, useFriend } from '../../../../../hooks/useRegister'
import Swal from 'sweetalert2';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DesktopHeader } from '../../../../../components/partials/desktopHeader';
import withAuth from '../../../../../app/authCheck';
import { useLocation } from 'react-router-dom';

// const userSchema = z.object({
//     UserName: z
//         .string()
//         .min(1, 'Name is required'),
//     UserFamilyName: z
//         .string()
//         .min(1, 'Family Name is required'),
//     UserGender: z.string().min(1, 'Gender is required'),
//     UserMaritalStatus: z.string().min(1, 'Marital status is required'),
//     UserDOB: z.string().refine((val) => !!val, {
//         message: 'Date of Birth is required',
//     }),

//     UserPhone: z
//         .string()
//         .min(1, "Phone number is required"),

//     UserEmail: z.string().email('Email is required'),
//     UserAddress: z.string().min(1, 'Address is required'),
//     UserType: z.string().min(1, 'Type is required'),
//     UserGroupID: z.string().optional(),
//     UserStatus: z.string().min(1, 'User status is required'),
//     UserChurchName: z.string().min(1, 'Pastoral Church Name is required'),
// });

const userSchema = z.object({
    UserName: z.string().min(1, 'Name is required'),
    UserFamilyName: z.string().min(1, 'Family Name is required'),
    UserGender: z.string().min(1, 'Gender is required'),
    UserMaritalStatus: z.string().min(1, 'Marital status is required'),
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
    UserEmail: z.string().optional(),
    UserAddress: z.string().optional(),
    UserStatus: z.string().min(1, 'Status is required'),
    UserType: z.string().min(1, 'User Type is required'),
    UserGroupID: z.string().optional(),
    UserChurchName: z.string().optional(),
}).superRefine((data, ctx) => {
    if ((data.UserType === 'Pastor' || data.UserType === 'Exco') && !data.UserEmail) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Email is required for Pastor or Exco',
            path: ['UserEmail'],
        });
    }
});


function AddFriend() {

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
    })

    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<string>('Member');

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const fileInputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

    const { mutate: addFriend, isLoading: registerLoader, error: regError } = useFriend(token);


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


    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(userSchema),
    });

    const onSubmit: any = (data: any) => {
        const completeData = { ...data, profileImage };
        addFriend(completeData, {
            onSuccess: (data) => {

                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    text: 'User has been successfully added!',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(-1);
                    }
                });

            },
            onError(error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: `${error}`,
                    confirmButtonText: 'OK',
                });
            }
        });
    };

    const { data: groups, isLoading, error } = useGroups(token);

    const location = useLocation();
    const state: string | null = location.state as string | null;

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
        <>
            <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-black">
                <div className="w-full max-w-lg bg-white rounded-lg md:shadow-lg overflow-hidden">
                    <div className="p-4 sm:p-6 md:p-8">
                        <div className="flex items-center mb-6">
                            <button
                                // onClick={() => router.back()}
                                onClick={() => navigate(-1)} // Navigates back to the previous page

                                className="text-gray-600 hover:text-gray-800 mr-4"
                            >
                                <ArrowLeft className="h-6 w-6 text-blue-400" />
                            </button>
                            <h2 className="text-xl font-bold">{state ? state : "Add Friend"}</h2>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

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
                                    {...register('UserFamilyName')}

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
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1"> Date of Birth (YYYY-MM-DD format only)</label>

                                {/* Date input for desktop */}
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
                                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number </label>
                                <input
                                    type="tel"
                                    id="UserPhone"
                                    {...register('UserPhone')}
                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = e.target.value; // Remove non-digit characters
                                        if (value.length <= 500) { // Allow max 10 digits
                                            e.target.value = value;
                                        } else {
                                            e.target.value = value.slice(0, 10); // Trim to 10 digits
                                        }
                                    }}
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
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address </label>
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
                                    Group
                                </label>
                                <select
                                    id="UserType"
                                    {...register('UserGroupID')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                            {errors.UserGroupID && typeof errors.UserGroupID.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors?.UserGroupID.message}</p>
                            )}

                            <div>
                                <label htmlFor="pastoralChurchName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Type <span className='text-red-500'>*</span>
                                </label>
                                <select
                                    id="UserType"
                                    {...register('UserType')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="Member">Member</option>
                                    <option value="Outstation Member">Outstation Member</option>
                                    <option value="Friend">Friend</option>
                                </select>
                            </div>
                            {errors.UserType && typeof errors.UserType.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors?.UserType.message}</p>
                            )}

                            <div>
                                <label htmlFor="pastoralChurchName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status <span className='text-red-500'>*</span>
                                </label>
                                <select
                                    id="UserStatus"
                                    {...register('UserStatus')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Lost">Lost</option>
                                    <option value="NeedVisting">NeedVisiting</option>
                                    <option value="NeedAttention">NeedAttention</option>
                                </select>
                            </div>
                            {errors.UserStatus && typeof errors.UserStatus.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors?.UserStatus.message}</p>
                            )}


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
                                {isLoading ? 'Registering...' : 'Add Friend'}
                            </button>

                            {/* {error && <p className="error">{error.message}</p>} */}

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withAuth(AddFriend);
