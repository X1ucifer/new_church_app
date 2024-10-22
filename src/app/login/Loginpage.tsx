import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { z } from 'zod';
import { useLogin } from '../../hooks/useLogin';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import { useSendOTP } from '../../hooks/useRegister';
import Swal from 'sweetalert2';

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .refine(
            (value) => value.includes('@') || !isNaN(Number(value)),
            "Enter a valid email"
        ),
    password: z.string().min(6, "Password must be at least 6 characters"),
});


export default function ChurchLogin() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false)
    const [activeTab, setActiveTab] = useState('Local Pastor')
    const [loginError, setLoginError] = useState<string | null>(null);

    const { mutate, isLoading, isError, error } = useLogin();
    const router = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const sendOTP = useSendOTP();


    const onSubmit: any = (data: { email: string; password: string }) => {

        const formattedData = {
            UserEmail: data.email,
            UserPassword: data.password,
        };


        // mutate(formattedData, {
        //     onSuccess: (responseData) => {
        //         localStorage.setItem('UserEmail', responseData.user.UserEmail);

        //         console.log("data", responseData.user.UserEmailVerified)
        //         const userData = {
        //             user: responseData.user,
        //             token: responseData.accessToken,
        //         };

        //         dispatch(loginSuccess(userData));

        //         if (responseData.user.UserEmailVerified == "1") {
        //             navigate('/dashboard');

        //         } else {
        //             sendOTP.mutate(
        //                 { UserEmail: responseData.user.UserEmail },
        //                 {
        //                     onSuccess: () => {
        //                         router('/register/verify-otp');
        //                     },
        //                     onError: (error: any) => {
        //                         Swal.fire({
        //                             icon: 'error',
        //                             title: 'OTP Sending Failed',
        //                             text: error?.message || 'Failed to send OTP. Please try again.',
        //                             confirmButtonText: 'OK',
        //                         });
        //                     }
        //                 }
        //             );
        //         }

        //     },
        //     onError: (error: any) => {
        //         console.log("d", error)
        //         if (error.response?.status === 401) {
        //             setLoginError('Unauthorized access. Please check your credentials.');
        //         } else {
        //             setLoginError('Unauthorized access. Please check your credentials.');
        //         }
        //     },
        // });

        mutate(formattedData, {
            onSuccess: (responseData) => {
                // Check if email is verified before storing user data in localStorage
                if (responseData.user.UserEmailVerified == "1") {
                    localStorage.setItem('UserEmail', responseData.user.UserEmail);

                    const userData = {
                        user: responseData.user,
                        token: responseData.accessToken,
                    };

                    // Dispatch loginSuccess and navigate to dashboard
                    dispatch(loginSuccess(userData));
                    navigate('/dashboard');
                } else {
                    // Do not store any sensitive information, proceed to OTP verification
                    sendOTP.mutate(
                        { UserEmail: responseData.user.UserEmail },
                        {
                            onSuccess: () => {
                                localStorage.setItem('UserEmail', responseData.user.UserEmail);
                                router('/register/verify-otp');
                            },
                            onError: (error: any) => {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'OTP Sending Failed',
                                    text: error?.message || 'Failed to send OTP. Please try again.',
                                    confirmButtonText: 'OK',
                                });
                            }
                        }
                    );
                }
            },
            onError: (error: any) => {
                // console.log("Error:", error?.response?.status);
                if (error.response?.status === 401) {
                    setLoginError('Unauthorized access. Please check your credentials.');
                } else {
                    setLoginError('Unauthorized access. Please check your credentials.');
                }
            },
        });

    };

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 text-black">
            <div className="w-full h-full max-w-7xl bg-white md:shadow-lg overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 bg-white-500 md:bg-purple-700 p-6 flex flex-col justify-between">
                    <div className="items-center justify-start md:justify-start md:flex">
                        <img src="/logo.png" width={80} height={80} alt="Church Logo" className="mr-2 " />
                        <h1 className="md:text-xl md:font-bold  md:text-white text-[#1D366C] font-bold text-xl">True Jesus Church</h1>
                    </div>
                    <div className="hidden md:block">
                        <img src="/church.png?height=400&width=400" width={400} height={400} alt="Church Building" className="mx-auto" />
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                    <div className="md:hidden mb-6">
                        <img src="/church.png?height=200&width=200" width={400} height={400} alt="Church Building" className="mx-auto" />
                    </div>

                    <h2 className="text-3xl font-bold mb-8 md:text-3xl md:font-bold md:text-center md:mb-8 text-black">Login</h2>

                    {loginError && (
                        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-md">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="text"
                                id="email"
                                {...register('email')}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="john@gmail.com"
                            />
                            {errors.email && typeof errors.email.message === 'string' && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password <span className='text-red-500'>*</span>
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    {...register('password')}
                                    className={`block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.password && typeof errors.password.message === 'string' && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isLoading} // Disable the button when loading
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>

                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}