import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Camera } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom' // Import useParams and useNavigate
import { useGroups, useRegister } from '../../../../hooks/useRegister'
import Swal from 'sweetalert2';
import { useEditMember, useMember } from '../../../../hooks/useMembersData'
import withAuth from '../../../../app/authCheck';

interface FormDataType {
    UserName: string;
    UserFamilyName: string;
    UserGender: string;
    UserMaritalStatus: string;
    UserDOB: string;
    UserPhone: string;
    UserEmail: string;
    UserAddress: string;
    UserType: string;
    UserStatus: string;
    UserChurchName: string;
    UserGroupID: string;
}

function UpdateMember() {
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
        UserStatus: '',
        UserChurchName: '',
        UserGroupID: '',
    });
    const [userType, setUserType] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);  // For preview
    const [validationErrors, setErrors] = useState<{ [key: string]: string | undefined }>({});
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { id } = useParams<{ id: any }>();

    const { mutate: editMember, isLoading: Loading, error: Error } = useEditMember();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        if (name === 'UserEmail') {
            // Simple regex for email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(value)) {
                setErrors(prevErrors => ({ ...prevErrors, UserEmail: 'Invalid email format.' }));
            } else {
                setErrors(prevErrors => ({ ...prevErrors, UserEmail: undefined })); // Clear error if valid
            }
            // Since the input is disabled, we don't update the formData here
            return;
        }

        // Validation for UserPhone
        if (name === 'UserPhone') {
            const phoneNumber = value; // Remove non-digit characters
            if (phoneNumber.length <= 500) {
                setFormData(prevData => ({ ...prevData, [name]: phoneNumber }));
                setErrors(prevErrors => ({ ...prevErrors, UserPhone: undefined }));
            } else {
                setErrors(prevErrors => ({ ...prevErrors, UserPhone: 'Phone number cannot exceed 10 digits.' }));
            }
        }


        // No restrictions for UserName, UserFamilyName, and UserAddress
        else if (name === 'UserName' || name === 'UserFamilyName' || name === 'UserAddress') {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }

        // Handle other fields
        else {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }


    };




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
            };
            reader.readAsDataURL(file);
        }
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

    const { data: groups, isLoading, error } = useGroups(token);
    const { data: member, isLoading: editLoading, error: editError } = useMember(token, id as any);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const selectedDate = new Date(formData.UserDOB);
        const minDate = new Date('1940-01-01');
        const maxDate = new Date();

        // Initialize an array to collect error messages
        const errors: string[] = [];

        console.log("date", formData.UserDOB)
        // Validate DOB
        if (!formData.UserDOB) {
            errors.push('Date of Birth is required.');
        } else {
            if (selectedDate < minDate) {
                errors.push('Date of birth cannot be before 1940.');
            }
            if (selectedDate > maxDate) {
                errors.push('Date of birth cannot be in the future.');
            }
        }

        // Validate UserEmail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.UserEmail) {
            errors.push('Email is required.');
        } else if (!emailRegex.test(formData.UserEmail)) {
            errors.push('Invalid email format.');
        }

        // If there are validation errors, show alert and return
        if (errors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: errors.join(' '),
                confirmButtonText: 'OK',
            });
            return; // Stop further execution
        }

        const dataToSend = new FormData();

        // Append the profile image if it exists
        if (profileImage) {
            dataToSend.append('UserProfile', profileImage);
        }

        // Append all form data
        Object.keys(formData).forEach(key => {
            dataToSend.append(key, formData[key as keyof FormDataType]); // Use keyof to assert type
        });

        editMember(
            { token, id, data: dataToSend },
            {
                onSuccess() {
                    navigate(`/dashboard/account/profile/${id}`);
                },
                onError(error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Update Failed',
                        text: `${error}`,
                        confirmButtonText: 'OK',
                    });
                },
            }
        );
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
                UserType: member?.UserType || '',
                UserStatus: member.UserStatus || '',
                UserChurchName: member.UserChurchName || '',
                UserGroupID: member.UserGroupID || '',
            });
            // Set profile image if available
            if (member.UserProfile) {
                setProfileImagePreview(member.UserProfile);
            }
        }
    }, [member]);

    console.log("d", profileImagePreview)

    useEffect(() => {
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') || '' : '';
        const parsedData = userData ? JSON.parse(userData) : null;
        const userType = parsedData?.user.UserType;
        setUserType(userType);
    }, []);



    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-black">
            <div className="w-full max-w-lg bg-white rounded-lg md:shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center mb-6">
                        <button
                            // onClick={() => router.back()}
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-gray-800 mr-4"
                        >
                            <ArrowLeft className="h-6 w-6 text-blue-400" />
                        </button>
                        <h2 className="text-xl font-bold">Edit Member</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                name="UserName"
                                value={formData.UserName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-1">Family Name <span className='text-red-500'>*</span></label>
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
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender <span className='text-red-500'>*</span></label>
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
                                <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">Marital Status <span className='text-red-500'>*</span></label>
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

                        {isMobile ? (
                            <input
                                type="text"
                                id="UserDOBText" 
                                name="UserDOB"
                                required
                                value={formData.UserDOB || ''}
                                onChange={handleChange}
                                className="block md:hidden w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="YYYY-MM-DD"
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    e.target.value = e.target.value.replace(/[^0-9-]/g, '');
                                }}
                            />
                        ) : (
                            <input
                                type="date"
                                id="UserDOB"
                                name="UserDOB"
                                value={formData.UserDOB || ''}
                                onChange={handleChange}
                                className="hidden md:block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                                max={new Date().toISOString().split('T')[0]}
                            />
                        )}


                        <div>
                            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <input
                                type="tel"
                                id="UserPhone"
                                name="UserPhone"
                                value={formData.UserPhone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                            <input
                                type="email"
                                id="UserEmail"
                                name="UserEmail"
                                value={formData.UserEmail}
                                disabled={member?.UserType === "Pastor" || member?.UserType === "Exco"}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                            ></textarea>
                        </div>

                        {member?.UserType !== "Admin" && (
                            <>
                                <div>
                                    <label htmlFor="pastoralChurchName" className="block text-sm font-medium text-gray-700 mb-1">
                                        User Type <span className='text-red-500'>*</span>
                                    </label>
                                    <select
                                        id="UserType"
                                        disabled={member?.UserType === "Pastor" || member?.UserType === "Exco"}
                                        name="UserType"
                                        value={formData.UserType}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select</option>
                                        {/* If the current member's UserType is set, show it as the selected value */}
                                        {(member?.UserType === "Pastor" || member?.UserType === "Exco") && (
                                            <option value={member?.UserType} disabled>
                                                {member?.UserType}
                                            </option>
                                        )}

                                        {/* Show additional options for non-Pastor and non-Exco users */}
                                        {/* {userType !== "Pastor" && userType !== "Exco" && (
                                            <>
                                                <option value="Pastor">Pastor</option>
                                                <option value="Exco">Exco</option>
                                            </>
                                        )} */}
                                        <option value="Outstation Member">Outstation Member</option>
                                        <option value="Member">Member</option>
                                        <option value="Friend">Friend</option>
                                    </select>

                                </div>
                            </>
                        )}


                        {member?.UserType !== "Admin" && (
                            <>
                                <div>
                                    <label htmlFor="pastoralChurchName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Status <span className='text-red-500'>*</span>
                                    </label>
                                    <select
                                        id="UserStatus"
                                        name="UserStatus"
                                        value={formData.UserStatus}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Lost">Lost</option>
                                        <option value="NeedVisting">NeedVisiting</option>
                                        <option value="NeedAttention">NeedAttention</option>
                                    </select>
                                </div>
                            </>
                        )}

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

export default withAuth(UpdateMember);
