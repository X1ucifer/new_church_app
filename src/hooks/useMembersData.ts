import { useQuery } from 'react-query';
import { membersData, searchMembers, getMember, deleteMember, editMember } from '@/utils/api';
import { useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useMutation } from 'react-query';


export function useMembersData(token: string) {
    const {
        data,
        error,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(
        ['members'],
        ({ pageParam = 1 }) => membersData({ pageParam, token }),
        {
            getNextPageParam: (lastPage) => (lastPage.isLastPage ? false : lastPage.nextPage),
        }
    );

    return {
        data,
        error,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    };
}

export const useSearchMembers = (token: string, searchTerm: string) => {
    return useQuery(
        ['searchMembers', searchTerm],
        () => searchMembers(token, searchTerm),
        {
            enabled: !!searchTerm,
            keepPreviousData: true,
        }
    );
};

export const useMember = (token: string, id: number) => {
    return useQuery(
        ['member', id],
        () => getMember(token, id),
        {
            enabled: !!id, 
        }
    );
};

export const useDeleteMember = () => {
    return useMutation(
        async ({ id, token }: { id: number, token: string }) => {
            const message = await deleteMember(token, id);
            return message;
        },
        {
            onSuccess: (message) => {
                // Handle success, e.g., show a success message or redirect
                console.log(message);
                // Optionally, you can trigger a refetch of members or redirect
            },
            onError: (error) => {
                // Handle error, e.g., show an error message
                console.error(error);
            },
        }
    );
};


export const useEditMember = () => {
    return useMutation(
        ({ token, id, data }: { token: string; id: number; data: any }) => editMember(token, id, data)
    );
};