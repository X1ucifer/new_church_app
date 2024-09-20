import { useMutation } from 'react-query';
import { loginUser } from '../utils/api';


export const useLogin = () => {
    return useMutation(loginUser);
};