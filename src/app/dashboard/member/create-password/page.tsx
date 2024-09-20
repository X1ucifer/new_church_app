'use client'

import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCreatePassword } from '@/hooks/useRegister';
import Swal from 'sweetalert2';

export default function PasswordSetup() {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter();

    const { mutate: createPassword, isLoading, error } = useCreatePassword();

    const UserEmail = typeof window !== 'undefined' ? localStorage.getItem('UserEmail') || '' : '';


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newPassword === confirmPassword) {
            createPassword({ UserEmail, newPassword, newPasswordConfirmation: confirmPassword }, {
                onSuccess: () => {
                    localStorage.removeItem('UserEmail');
                    Swal.fire({
                        icon: 'success',
                        title: 'User Created!',
                        text: 'Your password has been created successfully.',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        router.push('/dashboard'); 
                    });
                },
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Passwords Mismatch',
                text: 'Please make sure both passwords match.',
                confirmButtonText: 'OK',
            });
        }
    }

    

    return (
        <div className="md:min-h-screen bg-white flex flex-col items-center justify-center p-4 text-black">
            <div className="w-full max-w-md bg-white rounded-lg md:shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                    <button onClick={() => router.back()} className="mb-4 text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="h-6 w-6 text-blue-400" />
                    </button>

                    <div className="flex justify-center mb-6">
                        <Image src="/password.png" width={400} height={400} alt="Logo" className="mr-2 mb-[10px] md:mb-0" />
                    </div>

                    <h2 className="text-2xl font-bold mb-8 md:text-2xl md:font-bold md:text-center md:mb-2">Set up your <br className="block md:hidden" /> Password</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}