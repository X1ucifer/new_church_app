'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useForgotPassword';

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const router = useNavigate();
    const { mutate: requestPasswordReset, isLoading } = useForgotPassword();
 const navigate=useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        requestPasswordReset(email, {
            onSuccess: () => {
                setSuccess('A password reset link has been sent to your email.');
                localStorage.setItem('email', email);
                navigate('/forgot-password/otp');
            },
            onError: (error: Error) => {
                setError(error.message);
            }
        });
    };

    return (
        <div className="md:min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full h-full max-w-md bg-white rounded-lg md:shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">

                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-gray-800 mr-4"
                        >
                            <ArrowLeft className="h-6 w-6 text-blue-400" />
                        </button>
                    </div>

                    <div className="flex justify-center mb-6">
                        <img src="/forgetpassword.png" width={400} height={400} alt="Logo" className="mr-2 " />
                    </div>

                    <h2 className="text-2xl font-bold mb-2 md:text-2xl md:font-bold md:text-center md:mb-2">
                        Forgot <br className="block md:hidden" /> Password?
                    </h2>

                    <p className="text-gray-600 mb-8 md:text-gray-600 md:text-center md:mb-6">
                        Don't worry! Please enter the email address associated with your account.
                    </p>

                    {success && (
                        <div className="bg-green-100 text-green-700 p-4 mb-6 rounded-md">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="john@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {isLoading ? 'Sending OTP...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}