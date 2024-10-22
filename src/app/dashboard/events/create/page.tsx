import React, { useEffect, useRef, useState } from 'react'
import { X, ChevronDown, Clock, Calendar } from 'lucide-react'
import { useAddEvent } from '../../../../hooks/useEvents'
import { useChurches } from '../../../../hooks/useRegister';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import OutsideClickHandler from 'react-outside-click-handler';


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
    eventName: z.string().min(1, 'Event name is required').max(100, 'Event name must be less than 50 characters'),
    eventType: z.string().min(1, 'Event type is required'),
    leader: z
        .string()
        .min(1, 'Leader is required'),
    time: z.string().min(1, 'Time is required'),
    date: z.string().min(1, 'Date is required'),
    EventChurchName: z.string().min(1, 'Pastoral Church name is required'),
})

export default function NewEvent({ onClose }: any) {

    const format = 'h:mm a';

    const now = moment().hour(0).minute(0);

    function onChange(value: any) {
        console.log(value && value.format(format));
    }


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

    const timePickerRef = useRef<any>(null);

    const closeDropdown = () => {
        setIsOpen(false)
    }



    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

    const { mutate: addEvent, isLoading, error } = useAddEvent(token);
    const { data: churches, isLoading: isChurchLoading, isError: isChurchError } = useChurches();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        trigger,
        watch
    } = useForm({
        resolver: zodResolver(eventSchema),
    });

    const onSubmit = (data: any) => {
        addEvent(
            {
                ...data,
            },
            {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            }
        );
    };

    const selectedTime = watch('time');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the click is outside the TimePicker and the picker is open
            if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node) && isOpen) {
                setIsOpen(false); // Close the TimePicker if the click is outside
            }
        };

        // Add event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg shadow-lg">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">New Event </h2>
                    <button onClick={onClose}
                        className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                    <div>
                        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Name <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type="text"
                            id="eventName"
                            {...register('eventName')}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter Event Name"
                        />
                        {errors.eventName && typeof errors.eventName.message === 'string' && (
                            <p className="text-red-500 text-sm">{errors?.eventName.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Type <span className='text-red-500'>*</span>
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
                            Leader <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type="text"
                            id="leader"
                            {...register('leader')}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter Leader Name"
                        />
                        {errors.leader && typeof errors.leader.message === 'string' && (
                            <p className="text-red-500 text-sm">{errors.leader.message}</p>
                        )}
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                Time <span className='text-red-500'>*</span>
                            </label>
                            <div className="relative">
                                <OutsideClickHandler
                                    onOutsideClick={() => {
                                    }}
                                >
                                    <TimePicker
                                        showSecond={false}
                                        defaultValue={selectedTime ? moment(selectedTime, 'h:mm A') : moment()}
                                        className="w-full p-1 border rounded-md appearance-none"
                                        format="h:mm A"
                                        use12Hours
                                        open={isOpen}
                                        onOpen={() => setIsOpen(true)}
                                        inputReadOnly
                                        onClose={() => setIsOpen(false)}
                                        {...register('time')}
                                        onChange={(newTime) => {
                                            const formattedTime = newTime ? newTime.format('h:mm A') : '';

                                            // Convert selectedTime (string) back to a Moment object for comparison
                                            const selectedMomentTime = selectedTime ? moment(selectedTime, 'h:mm A') : null;

                                            // Compare AM/PM of the new time with the previously selected time
                                            if (newTime && selectedMomentTime && newTime.format('A') !== selectedMomentTime.format('A')) {
                                                setIsOpen(false);
                                            }

                                            setValue('time', formattedTime); // Update the form field with the formatted time
                                            trigger('time'); // Trigger validation for the time field
                                        }}
                                    />
                                </OutsideClickHandler>


                                {errors.time && typeof errors.time.message === 'string' && (
                                    <p className="text-red-500 text-sm">{errors.time.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex-1">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                Date <span className='text-red-500'>*</span>
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
                    {/* <div>
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
                    </div> */}
                    <div>
                        <label htmlFor="churchName" className="block text-sm font-medium text-gray-700 mb-1">Pastoral Church Name <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type="text"
                            id="EventChurchName"
                            placeholder="Enter Church Name"
                            {...register('EventChurchName')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.EventChurchName && typeof errors.EventChurchName.message === 'string' && (
                            <p className="text-red-500 text-sm">{errors?.EventChurchName.message}</p>
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