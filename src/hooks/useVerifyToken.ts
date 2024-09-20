import { useQuery } from 'react-query';
import { verifyToken } from '../utils/api'; 

export const useVerifyToken = (token: string) => {
  return useQuery(['verifyToken', token], () => verifyToken(token), {
    staleTime: 600000, // 10 minutes
    cacheTime: 900000, // 15 minutes
    retry: false, // Disable retries if token is invalid
  });
};
