import { getDashboard } from '../utils/api'
import { useQuery } from 'react-query';


export const useDashboard = (token: string) => {
    return useQuery(
      ['dashboard', token],
      () => getDashboard(token), 
      {
        enabled: !!token, // Only fetch if token is available
        // staleTime: 5 * 60 * 1000, 
      }
    );
  };
  