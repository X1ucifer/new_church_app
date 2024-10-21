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
        const response = await api.post('/register', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.user;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.errors?.UserProfile?.[0] || error.response?.data.error ||
                error.response?.data?.errors?.UserEmail?.[0] || error.response?.data?.errors?.UserPhone?.[0] ||
                error.response?.data?.errors?.UserChurchName?.[0] || error.response?.data?.errors?.UserName?.[0] ||
                error.response?.data?.errors?.UserFamilyName?.[0] || error.response?.data?.errors?.UserGender?.[0] ||
                error.response?.data?.errors?.UserMaritalStatus?.[0] || error.response?.data?.errors?.UserDOB?.[0] ||
                error.response?.data?.errors?.UserAddress?.[0] || error.response?.data?.message || 'Failed to register try again.'


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
            const errorMessage = error.response?.data?.errors.UserEmail?.[0] ||
                'Failed to request password reset. Please try again.';
            throw new Error(errorMessage);
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
                error.response?.data?.errors?.UserOTP?.[0] ||
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
                error.response?.data?.errors?.new_password?.[0] ||
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
                error.response?.data?.errors?.new_password?.[0] ||
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
    EventChurchName: string
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
                EventChurchName,
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
                error.response?.data?.errors?.EventName?.[0] || error.response?.data?.errors?.EventLeader?.[0] ||
                error.response?.data?.errors?.EventChurchName?.[0] || error.response?.data?.message || 'Failed to add the event. Please try again.'
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

export const filterMembers = async (token: string, filter_type: string, page: number, search: string, id?: any) => {
    try {
        const url = id ? `/user/filterByType/${id}` : `/user/filterByType`;
        const response = await api.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                filter_type: filter_type,
                page: page,  // Pass the page number
                search: search, // Add the search parameter
            },
        });
        console.log("API Response:", response.data);
        return response.data;
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
                error.response?.data?.errors?.UserPassword?.[0] ||
                error.response?.data?.message || 'Failed to create password. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const otpSend = async (UserEmail: string) => {
    try {
        const response = await api.post('/otp/send', { UserEmail });
        return response.data.message;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to send OTP. Please try again.'
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
        const response = await api.post(`/user/updateMemberProfile/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.message;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 500) {
                throw new Error('Something went wrong.');
            }

            // Specific field error handling
            throw new Error(
                error.response?.data?.errors?.UserEmail?.[0] || error.response?.data?.errors?.UserPhone?.[0] ||
                error.response?.data?.errors?.UserChurchName?.[0] || error.response?.data?.errors?.UserName?.[0] ||
                error.response?.data?.errors?.UserFamilyName?.[0] || error.response?.data?.errors?.UserGender?.[0] ||
                error.response?.data?.errors?.UserMaritalStatus?.[0] || error.response?.data?.errors?.UserDOB?.[0] ||
                error.response?.data?.errors?.UserProfile?.[0] || error.response?.data.error ||
                error.response?.data?.errors?.UserAddress?.[0] || error.response?.data?.message || 'Failed to update member. Please try again.'
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

export const updateAttendance = async (token: string, eventId: number, users: any) => {
    try {
        const response = await api.post(`/event/updateAttendance/${eventId}`, {
            ...users,
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
            EventChurchName: eventData.EventChurchName,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.message;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.errors?.EventName?.[0] || error.response?.data?.errors?.EventLeader?.[0] ||
                error.response?.data?.errors?.EventChurchName?.[0] || error.response?.data?.message || 'Failed to update event. Please try again'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const getAttendance = async (token: string, id: number) => {
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

export const addFriend = async (token: string, data: any) => {
    try {
        const response = await api.post('/user/newFriends', {
            ...data
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.errors?.UserEmail?.[0] || error.response?.data?.errors?.UserPhone?.[0] || error.response?.data.error ||
                error.response?.data?.errors?.UserChurchName?.[0] || error.response?.data?.errors?.UserName?.[0] ||
                error.response?.data?.errors?.UserFamilyName?.[0] || error.response?.data?.errors?.UserGender?.[0] ||
                error.response?.data?.errors?.UserMaritalStatus?.[0] || error.response?.data?.errors?.UserDOB?.[0] ||
                error.response?.data?.errors?.UserAddress?.[0] || error.response?.data?.message || 'Failed to update member. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const membersImport = async (token?: string, file?: File) => {
    try {
        const formData = new FormData();
        formData.append('excel_file', file as Blob);

        const response = await api.post('/excel_import', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 500) {
                throw new Error(
                    error.response?.data?.message ||
                    'An error occurred during import. Please check the sheet and try again.'
                );
            }

            const csvData = error.response?.data;
            // const incompleteMessage = error.response?.data?.messages?.incomplete;
            // const duplicateMessage = error.response?.data?.messages?.duplicate;
            // const success = error.response?.data?.messages?.success;

            // let errorMessage = 'Failed to upload members data. Please try again.';
            // const errorMessages = [];

            // if (incompleteMessage) {
            //     errorMessages.push(incompleteMessage);
            // }
            // if (duplicateMessage) {
            //     errorMessages.push(duplicateMessage);
            // }
            // if (duplicateMessage) {
            //     errorMessages.push(success);
            // }

            // if (errorMessages.length > 0) {
            //     errorMessage = errorMessages.join('\n'); // Join messages with a newline
            // }

            throw new Error(csvData);
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const reportUsers = async (token: string, report_type: string, page: number, search: string) => {
    try {
        const response = await api.get('/report', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                report_type,
                page, // Include the page parameter
                search, // Include the search parameter
            },
        });

        return response; // Return the response
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch users. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};


export const reportExport = async (token?: string, report_type?: string, searchTerm?: any) => {
    try {
        const response = await api.get('/reportExcelDownload', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                report_type,
                search: searchTerm,
            },
        });

        return response; // Return only the data part of the response
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to export users. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const membersExport = async (token?: string, report_type?: string, searchTerm?: any) => {
    try {
        const response = await api.get('/totalExcelDownload', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response; // Return only the data part of the response
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to export users. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const getSampleCSV = async () => {
    try {
        const response = await api.get('/templateDownload', {
            responseType: 'blob', // Important for downloading files
        });

        // Create a Blob from the response
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a link element, set the URL, and download
        const link: any = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Sample_Members.csv'); // Define the file name
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link); // Clean up

        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || 'Failed to get CSV. Please try again.'
            );
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};


export default api;