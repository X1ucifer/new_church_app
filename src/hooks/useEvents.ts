import { useQuery, useMutation, useQueryClient } from 'react-query';
import { addEvent, deleteEvent, filterMembers, getAttendance, getEvent, getRights, upcomingEvenrs, updateEvent } from '../utils/api';
import { useDispatch } from 'react-redux';
import { addEvents, deleteEvent as deleteEventAction } from '../redux/slices/eventSlice';

export const useUpcomingEvents = (token: string) => {
  return useQuery('upcomingEvents', () => upcomingEvenrs(token), {
    staleTime: 300000,
    cacheTime: 600000,
  });
};

export const useEventDetails = (token: string, id: number) => {
  return useQuery(
    ['eventDetails', id],
    () => getEvent(token, id),
    {
      enabled: !!id,
      staleTime: 300000,
      cacheTime: 600000,
    }
  );
};

export const useAddendance = (token: string, id: number) => {
  return useQuery(
    ['attendance', id],
    () => getAttendance(token, id),
    {
      enabled: !!id,
      staleTime: 300000,
      cacheTime: 600000,
    }
  );
};

export const useEditEvent = (token: string) => {
  return useMutation((data: { id: number; eventData: any }) => updateEvent(token, data));
};

export const useRights = (token: string) => {
  return useQuery(
    ['useRights'],
    () => getRights(token),
    {
      staleTime: 300000,
      cacheTime: 600000,
    }
  );
};


export const useAddEvent = (token: string) => {
  const dispatch = useDispatch();

  return useMutation(
    ({ eventName, eventType, leader, time, date, EventChurchName }: any) =>
      addEvent(token, eventName, eventType, leader, time, date, EventChurchName),
    {
      onMutate: () => {
      },
      onSuccess: (data) => {
        dispatch(addEvents(data));
      },
      onError: (error: any) => {
      },
    }
  );
};

export const useDeleteEvent = (token: string) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (id: number) => deleteEvent(token, id),
    {
      onSuccess: (data, id) => {
        dispatch(deleteEventAction(id));
        queryClient.invalidateQueries('upcomingEvents'); // Invalidate React Query cache to refetch data
      },
      onError: (error) => {
        console.error('Error deleting event:', error);
      },
    }
  );
};

export const useFilterMembers = (token: string, filter_type: string, page: number, id?: any) => {
  return useQuery(
    ['filteredMembers', filter_type, page],
    () => filterMembers(token, filter_type, page, id),
    {
      keepPreviousData: true, // Ensures the previous data is kept while fetching new data
      cacheTime: 0, // No caching
      refetchOnWindowFocus: true,
      staleTime: 0,
    }
  );
};



// export const useFilterMembers = (token: string, filter_type: string, id?: any) => {
//   return useQuery(
//     ['filteredMembers', filter_type, id], // Include 'id' in the query key for uniqueness
//     () => filterMembers(token, filter_type, id),
//     {
//       cacheTime: 5 * 60 * 1000, // Cache data for 5 minutes
//       staleTime: 30 * 1000, // Consider data fresh for 30 seconds
//       refetchOnWindowFocus: true, // Refetch when window gains focus
//       refetchOnReconnect: true, // Refetch on network reconnect
//       refetchIntervalInBackground: false, // Disable background polling when not active
//     }
//   );
// };

