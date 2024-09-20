import { useQuery, useMutation, useQueryClient } from 'react-query';
import { addEvent, deleteEvent, filterMembers, getEvent, getRights, upcomingEvenrs } from '../utils/api';
import { useDispatch } from 'react-redux';
import { addEvents,  deleteEvent as deleteEventAction } from '../redux/slices/eventSlice';

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
    ({ eventName, eventType, leader, time, date, churchID }: any) =>
      addEvent(token, eventName, eventType, leader, time, date, churchID),
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

export const useFilterMembers = (token: string, filter_type: string) => {
  return useQuery(['filteredMembers', filter_type], () => filterMembers(token, filter_type), {
      enabled: !!filter_type, 
      staleTime: 5 * 60 * 1000, 
      cacheTime: 10 * 60 * 1000,
  });
};