import React, { useEffect, useState } from 'react';
import { X, ChevronDown, Calendar, ArrowLeft } from 'lucide-react';
import { useAddEvent, useEditEvent, useEventDetails, useUpcomingEvents } from '../../../../hooks/useEvents';
import { useChurches } from '../../../../hooks/useRegister';
import TimePicker from 'react-time-picker';
import { useNavigate, useParams } from 'react-router-dom';
import withAuth from '../../../../app/authCheck';


interface EventDetails {
  EventName: string;
  EventType: string;
  EventLeader: string;
  EventTime: string;
  EventDate: string;
  EventChurchID: string;
}

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

const EditEvent: React.FC<any> = ({ onClose }) => {
  const [eventName, setEventName] = useState<string>('');
  const [eventType, setEventType] = useState<string>('');
  const [leader, setLeader] = useState<string>('');
  const [time, setTime] = useState<any>('10:00 AM');
  const [date, setDate] = useState<string>('');
  const [pastoralChurch, setPastoralChurch] = useState<string>('');

  const [isOpen, setIsOpen] = useState(false);

  const timeOptions = generateTimeOptions();


  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>(); // Extracting event id from URL params

  const token = localStorage.getItem('token') || '';

  const { data: event, isLoading: eventLoading, error: eventError } = useEventDetails(token, id as any);
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
      setPastoralChurch(event.EventChurchName);
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editEvent(
      {
        id,
        eventData: {
          eventName,
          eventType,
          leader,
          time,
          date,
          EventChurchName: pastoralChurch,
        },
      },
      {
        onSuccess: () => {
          navigate('/dashboard/events');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg shadow-lg text-black">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-full">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)} // Navigates back to the previous page

            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="h-6 w-6 text-blue-400" />
          </button>
          <h2 className="text-xl font-medium">Edit Event</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              maxLength={20}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Prayer Meeting"
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
              }}
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
              maxLength={20}
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Fedrick"
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
              }}
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <div className="relative">
                {/* <TimePicker id="time" value={time} onChange={setTime} format="hh:mm a" className="w-full p-2 border rounded-md" /> */}
                <select
                  id="time"
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
          {/* <div>
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
          </div> */}
          <div>
            <label htmlFor="churchName" className="block text-sm font-medium text-gray-700 mb-1">Pastoral Church Name
            </label>
            <input
              type="text"
              id="EventChurchName"
              maxLength={30}
              value={pastoralChurch}
                onChange={(e) => setPastoralChurch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            {isEditing ? 'Updating Event...' : 'Update Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default withAuth(EditEvent);
