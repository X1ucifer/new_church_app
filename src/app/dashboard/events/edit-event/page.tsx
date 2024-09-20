'use client'

import React, { useEffect, useState } from 'react'
import { X, ChevronDown, Clock, Calendar } from 'lucide-react'
import { useAddEvent, useEditEvent, useEventDetails, useUpcomingEvents } from '@/hooks/useEvents'
import { useChurches } from '@/hooks/useRegister';
import TimePicker from 'react-time-picker';
import { useRouter } from 'next/navigation'
import withAuth from '@/app/authCheck';

function NewEvent({ onClose, params }: any) {
    const [eventName, setEventName] = useState('')
    const [eventType, setEventType] = useState('')
    const [leader, setLeader] = useState('')
    const [time, setTime] = useState<any>('10:00')
    const [date, setDate] = useState('')
    const [pastoralChurch, setPastoralChurch] = useState('')
    const router = useRouter();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    
    const { data: event, isLoading: eventLoading, error:eventError } = useEventDetails(token, params?.id);

    const { mutate: editEvent, isLoading: isEditing, error: editError } = useEditEvent(token);

    const { data: churches, isLoading: isChurchLoading, isError: isChurchError } = useChurches();

    useEffect(() => {
        if (event) {
            setEventName(event.EventName);
            setEventType(event.EventType);
            setLeader(event.EventLeader);
            setTime(event.EventTime);
            const [day, month, year] = event.EventDate.split('-');
            const formattedDate = `${year}-${month}-${day}`;
            setDate(formattedDate);         
            setPastoralChurch(event.EventChurchID);
        }
    }, [event]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editEvent({ id:params?.id, eventData: {
            eventName,
            eventType,
            leader,
            time,
            date,
            churchID: pastoralChurch,
        }}, {
            onSuccess: () => {
                router.push('/dashboard/events');
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg shadow-lg text-black">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Edit Event</h2>
                    <button onClick={onClose}
                        className="text-gray-500 hover:text-gray-700">
                        {/* <X className="h-6 w-6" /> */}
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Name
                        </label>
                        <input
                            type="text"
                            id="eventName"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Prayer Meeting"
                        />
                    </div>
                    <div>
                        <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Type
                        </label>
                        <div className="relative">
                            <select
                                id="eventType"
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value)}
                                className="w-full p-2 border rounded-md appearance-none"
                            >
                                <option value="">Select event type</option>
                                <option value="Friday Sabbath">Friday Sabbath</option>
                                <option value="Saturday Sabbath">Saturday Sabbath</option>
                                <option value="Special service">Special service</option>
                                <option value="Weekday service">Weekday service</option>
                                <option value="Fellowship">Fellowship</option>
                                <option value="Online service">Online service</option>
                                <option value="Others">Others</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="leader" className="block text-sm font-medium text-gray-700 mb-1">
                            Leader
                        </label>
                        <input
                            type="text"
                            id="leader"
                            value={leader}
                            onChange={(e) => setLeader(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Fedrick"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                Time
                            </label>
                            <div className="relative">
                                <TimePicker
                                    id="time"
                                    value={time}
                                    onChange={setTime}
                                    format="hh:mm a"
                                    className="w-full p-2 border rounded-md"
                                />
                                {/* Optionally, you can add custom icons if desired */}
                            </div>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full p-2 border rounded-md pl-8"
                                />
                                <Calendar className="absolute left-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="pastoralChurch" className="block text-sm font-medium text-gray-700 mb-1">
                            Pastoral Church Name
                        </label>
                        <div className="relative">
                            <select
                                id="pastoralChurch"
                                value={pastoralChurch}
                                onChange={(e) => setPastoralChurch(e.target.value)}
                                className="w-full p-2 border rounded-md appearance-none"
                            >
                                <option value="">Select</option>

                                {isChurchLoading ? (
                                    <option value="">Loading...</option>
                                ) : isChurchError ? (
                                    <option value="">Error loading churches</option>
                                ) : (
                                    churches?.map((church: any) => (
                                        <option key={church.id} value={church.id}>
                                            {church.ChurchName}
                                        </option>
                                    ))
                                )}
                            </select>
                            <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                    >
                        {isEditing ? 'Updating Event...' : 'Update Event'}
                    </button>

                    {/* {error && <p className="text-red-500">{error.message}</p>} */}
                </form>
            </div>
        </div>
    )
}

export default withAuth(NewEvent);
