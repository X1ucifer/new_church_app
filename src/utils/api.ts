'use client'

import axios from 'axios';
import { AxiosError } from 'axios';

const api = axios.create({
    baseURL: 'https://tjc.wizappsystem.com/church/public/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const registerUser = async (data: any) => {
    try {
        const response = await api.post('/register', data);
        return response.data.user;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Registration failed. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const loginUser = async (data: { UserEmail: string; UserPassword: string }) => {
    try {
        const response = await api.post('/login', data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Login failed. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};


export const getChurch = async () => {
    try {
        const response = await api.get('/church/list_churches');
        return response.data.churches;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch churches. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const verifyToken = async (token: string) => {
    try {
        const response = await api.get('/verify-token', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to verify token. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const forgotPassword = async (UserEmail: string) => {
    try {
        const response = await api.post('/forgot_password', { UserEmail });

        console.log("out", response)
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to request password reset. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const verifyOTP = async (UserEmail: string, UserOTP: string) => {
    try {
        const response = await api.post('/otp/verify', { UserEmail, UserOTP });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to verify OTP. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const resetPassword = async (UserEmail: string, newPassword: string, newPasswordConfirmation: string) => {
    try {
        const response = await api.post('/reset_password', { UserEmail, new_password: newPassword, new_password_confirmation: newPasswordConfirmation });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to reset password. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const membersData = async ({ pageParam = 1, token }: { pageParam?: number; token: string }) => {
    try {
        const response = await api.get('/user/listMembers', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page: pageParam,
            },
        });

        return {
            users: response.data.user.data,
            nextPage: response.data.user.current_page + 1,
            isLastPage: response.data.user.current_page >= response.data.user.last_page
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch members. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const searchMembers = async (token: string, searchTerm: string) => {
    try {
        const response = await api.get(`/user/searchMember`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                query: searchTerm,
            },
        });

        return response.data.users;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch members. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const changePassword = async (token: string, old_password: string, new_password: string, new_password_confirmation: string) => {
    try {
        const response = await api.post('/user/change_password', {
            old_password,
            new_password,
            new_password_confirmation
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to change password. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const getMember = async (token: string, id: number) => {
    try {
        const response = await api.get(`/user/view-member-profile/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.user;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch member data. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const deleteMember = async (token: string, id: number) => {
    try {
        const response = await api.delete(`/user/deleteMemberProfile/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.message;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch member data. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const upcomingEvenrs = async (token: string) => {
    try {
        const response = await api.get('/event/upcomingEvents', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data.upcoming_events;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch members. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const getEvent = async (token: string, id: number) => {
    try {
        const response = await api.get(`/event/view/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.event;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch event details. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const addEvent = async (
    token: string,
    eventName: string,
    eventType: string,
    leader: string,
    time: string,
    date: string,
    churchID: string
) => {
    try {
        const response = await api.post(
            '/event/add',
            {
                EventName: eventName,
                EventType: eventType,
                EventLeader: leader,
                EventTime: time,
                EventDate: date,
                EventChurchID: churchID,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.event;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to add the event. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const deleteEvent = async (token: string, id: number) => {
    try {
        const response = await api.delete(`/event/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.message;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch member data. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const filterMembers = async (token: string, filter_type: string, id?:any) => {
    try {
        const url = id ? `/user/filterByType/${id}` : `/user/filterByType`;
        const response = await api.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                filter_type: filter_type,
            },
        });
        console.log("API Response:", response.data);
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch members. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const getGroups = async (token: string) => {
    try {
        const response = await api.get('/group/list', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.groups;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch groups. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};


export const createPassword = async (UserEmail: string, newPassword: string, newPasswordConfirmation: string) => {
    try {
        const response = await api.patch('/create_password', { UserEmail, UserPassword: newPassword, UserPassword_confirmation: newPasswordConfirmation });
        return response.data.message;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to create password. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const editMember = async (
    token: string,
    id: number,
    data: {
        UserName?: string;
        UserFamilyName?: string;
        UserGender?: string;
        UserMaritalStatus?: string;
        UserDOB?: string;
        UserPhone?: string;
        UserEmail?: string;
        UserAddress?: string;
        UserType?: string;
        UserChurchName?: string;
        UserGroupID?: string;
        profileImage?: string;
    }
) => {
    try {
        const response = await api.patch(`/user/updateMemberProfile/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.message;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to update member. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const getRights = async (token: string) => {
    try {
        const response = await api.get('/viewUsageRights', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.accessRights;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch rights. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const updateRights = async (
    token: string,
    user_type: string,
    accessRights: { dashboard: boolean, report: boolean, events: boolean, settings: boolean },
) => {
    try {
        const response = await api.post(
            '/updateUsageRights',
            {
                user_type,
                ...accessRights
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.event;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to update the rights. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const getDashboard = async (token: string) => {
    try {
        console.log("opan")
        const response = await api.get('/dashboard', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data.data)
        return {
           data: response.data.data,
           totalValues: response.data.totalValues,
           averageAttendance: response.data.averageAttendance
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch dashboard. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const updateAttendance = async (token: string, eventId: number, users: any[]) => {
    try {
        const response = await api.post(`/event/updateAttendance/${eventId}`, {
            users,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to update attendance. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const updateEvent = async (token: string, { id, eventData }: { id: number; eventData: any }) => {
    try {
        const response = await api.patch(`/event/update/${id}`, {
            EventName: eventData.eventName,
            EventType: eventData.eventType,
            EventLeader: eventData.leader,
            EventTime: eventData.time,
            EventDate: eventData.date,
            EventChurchID: eventData.churchID,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.message;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to update event. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const getAttendance = async (token: string, id:number) => {
    try {
        const response = await api.get(`/event/getAttendance/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch attendance. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};


export default api;