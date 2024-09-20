'use client'

import React, { useState } from 'react'
import { X, ChevronDown, Clock, Calendar } from 'lucide-react'
import { useAddEvent } from '@/hooks/useEvents'
import { useChurches } from '@/hooks/useRegister';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const generateTimeOptions: any = () => {
    const options: any = [];
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];

    hours.forEach(hour => {
        minutes.forEach(minute => {
            options.push(`${hour}:${minute} AM`);
            options.push(`${hour}:${minute} PM`);
        });
    });

    return options;
};

const eventSchema = z.object({
    eventName: z.string().min(1, 'Event name is required').max(50, 'Event name must be less than 50 characters'),
    eventType: z.string().min(1, 'Event type is required'),
    leader: z
        .string()
        .min(1, 'Leader is required')
        .regex(/^[a-zA-Z\s]*$/, 'Leader name can only contain letters and spaces'),
    time: z.string().min(1, 'Time is required'),
    date: z.string().min(1, 'Date is required'),
    pastoralChurch: z.string().min(1, 'Pastoral Church is required'),
})

export default function NewEvent({ onClose }: any) {
    const [eventName, setEventName] = useState('')
    const [eventType, setEventType] = useState('')
    const [leader, setLeader] = useState('')
    const [time, setTime] = useState<any>('10:00 AM')
    const [date, setDate] = useState('')
    const [pastoralChurch, setPastoralChurch] = useState('')

    const [isOpen, setIsOpen] = useState(false);
    const timeOptions = generateTimeOptions();

    const handleTimeSelect = (selectedTime: string) => {
        setTime(selectedTime);
        setIsOpen(false);
    };


    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

    const { mutate: addEvent, isLoading, error } = useAddEvent(token);
    const { data: churches, isLoading: isChurchLoading, isError: isChurchError } = useChurches();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(eventSchema),
    });

    const onSubmit = (data: any) => {
        addEvent(
            {
                ...data,
                churchID: data.pastoralChurch,
            },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg shadow-lg">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">New Event</h2>
                    <button onClick={onClose}
                        className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                    <div>
                        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Name
                        </label>
                        <input
                            type="text"
                            id="eventName"
                            {...register('eventName')}
                            className="w-full p-2 border rounded-md"
                            placeholder="Prayer Meeting"
                        />
                        {errors.eventName && typeof errors.eventName.message === 'string' && (
                            <p className="text-red-500 text-sm">{errors?.eventName.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Type
                        </label>
                        <div className="relative">
                            <select
                                id="eventType"
                                {...register('eventType')}
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
                        {errors.eventType && typeof errors.eventType.message === 'string' && (
                            <p className="text-red-500 text-sm">{errors.eventType.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="leader" className="block text-sm font-medium text-gray-700 mb-1">
                            Leader
                        </label>
                        <input
                            type="text"
                            id="leader"
                            {...register('leader')}
                            className="w-full p-2 border rounded-md"
                            placeholder="Fedrick"
                        />
                        {errors.leader && typeof errors.leader.message === 'string' && (
                            <p className="text-red-500 text-sm">{errors.leader.message}</p>
                        )}
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                Time
                            </label>
                            <div className="relative">
                                <select
                                    id="time"
                                    {...register('time')}
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full p-2 border rounded-md appearance-none"
                                >
                                    {generateTimeOptions().map((option: string) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                {errors.time && typeof errors.time.message === 'string' && (
                                    <p className="text-red-500 text-sm">{errors.time.message}</p>
                                )}
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
                                    {...register('date')}
                                    className="w-full p-2 border rounded-md pl-8"
                                />
                                <Calendar className="absolute left-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.date && typeof errors.date.message === 'string' && (
                                <p className="text-red-500 text-sm">{errors.date.message}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="pastoralChurch" className="block text-sm font-medium text-gray-700 mb-1">
                            Pastoral Church Name
                        </label>
                        <select
                            id="pastoralChurch"
                            {...register('pastoralChurch', { required: 'Please select a church' })} // Ensure registration
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
                        {errors.pastoralChurch && typeof errors.pastoralChurch.message === 'string' && (
                            <p className="text-red-500 text-sm mt-1">{errors.pastoralChurch.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                    >
                        {isLoading ? 'Adding Event...' : 'Add Event'}
                    </button>

                    {error && <p className="text-red-500">{error.message}</p>}
                </form>
            </div>
        </div>
    )
}