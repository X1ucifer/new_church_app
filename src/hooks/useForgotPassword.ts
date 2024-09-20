import { useMutation } from 'react-query';
import { forgotPassword, verifyOTP, resetPassword, changePassword } from '../utils/api';


export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (email: string) => forgotPassword(email),
        onError: (error: Error) => {
            console.error('Error requesting password reset:', error.message);
        },
        onSuccess: () => {
            console.log('Password reset email sent successfully.');
        }
    });
};

export const useForgotPasswordOTP = () => {
    return useMutation(
        (data: { email: string; otp: string }) => verifyOTP(data.email, data.otp),
        {
            onError: (error: Error) => {
                console.error('OTP verification failed:', error.message);
            },
        }
    );
};

export const useResetPassword = () => {
    return useMutation(
        (data: { email: string; newPassword: string; newPasswordConfirmation: string }) =>
            resetPassword(data.email, data.newPassword, data.newPasswordConfirmation),
        {
            onError: (error: Error) => {
                console.error('Password reset failed:', error.message);
            },
        }
    );
};


export const useChangePassword = () => {
    return useMutation(
        (data: { token: string; old_password: string; new_password: string; new_password_confirmation: string }) =>
            changePassword(data.token, data.old_password, data.new_password, data.new_password_confirmation),
        {
            onError: (error: Error) => {
                console.error('Error changing password:', error.message);
            },
        }
    );
};