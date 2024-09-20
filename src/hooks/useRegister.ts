'use client'

import { useMutation } from 'react-query';
import { registerUser, getChurch, getGroups, createPassword, editMember } from '../utils/api';
import { useQuery } from 'react-query';

export const useRegister = () => {
    return useMutation((data: any) => registerUser(data));
};

export const useChurches = () => {
    return useQuery('churches', getChurch);
};

export const useGroups = (token: string) => {
    return useQuery('groups', () => getGroups(token));
};

export const useCreatePassword = () => {
    return useMutation(
        ({ UserEmail, newPassword, newPasswordConfirmation }: { UserEmail: string, newPassword: string, newPasswordConfirmation: string }) =>
            createPassword(UserEmail, newPassword, newPasswordConfirmation)
    );
};

