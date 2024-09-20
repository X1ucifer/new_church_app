'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForgotPasswordOTP } from '../../../hooks/useForgotPassword';

export default function OTPVerification() {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const router = useRouter();

    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    const handleChange = (index: number, value: string) => {
        if (value.length <= 1) {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)

            if (value !== '' && index < 5) {
                inputRefs.current[index + 1]?.focus()
            }
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const { mutate: verifyOTP, isLoading } = useForgotPasswordOTP();

    const handleVerify = () => {
        const enteredOtp = otp.join('')
        console.log('Verifying OTP:', enteredOtp)
        const email = localStorage.getItem('email');

        if (!email) {
            setError('No email found. Please go back and try again.');
            return;
        }

        verifyOTP({ email, otp: enteredOtp }, {
            onSuccess: () => {
                setSuccess('OTP verified successfully.');
                router.push('/forgot-password/reset-password');
            },
            onError: (error: Error) => {
                setError('Failed to verify OTP. Please try again.');
            }
        });
    }

    return (
        <div className="md:min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg md:shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                    <button onClick={() => router.back()} className="mb-6 text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="h-6 w-6 text-blue-400" />
                    </button>

                    <div className="flex justify-center mb-6">
                        <Image src="/otp.png" width={400} height={400} alt="Logo" className="mr-2 mb-[10px] md:mb-0" />
                    </div>

                    <h2 className="text-2xl font-bold mb-[5px] md:text-2xl md:font-bold md:text-center md:mb-2">Enter OTP</h2>
                    <p className="text-center text-gray-600 mb-[27px] md:mb-6">
                        A 6 digit code has been sent to john@gmail.com
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

                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        OTP
                    </label>

                    <div className="flex justify-between mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                ref={(el: any) => (inputRefs.current[index] = el)}
                                className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleVerify}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
                    </button>
                </div>
            </div>
        </div>
    )
}