'use client'

import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Plus } from 'lucide-react'
import { DesktopHeader } from '@/components/partials/desktopHeader'
import { MobileHeader } from '@/components/partials/mobileHeader'
import NewEvent from './create/page'
import withAuth from '@/app/authCheck';
import { useUpcomingEvents, useDeleteEvent } from '@/hooks/useEvents';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchEventsSuccess } from '../../../redux/slices/eventSlice';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useRouter } from 'next/navigation';

const MySwal = withReactContent(Swal);

function ChurchEvents() {
  const [activeTab, setActiveTab] = useState('Events')

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleMoreClick = (index: number) => {
    if (selectedEvent === index) {
      setSelectedEvent(null); // Close if clicked again
    } else {
      setSelectedEvent(index); // Open dropdown for clicked event
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectedEvent(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  const events = useSelector((state: RootState) => state.events.events);

  const { data: fetchedEvents, isLoading: isFetching, error: fetchError } = useUpcomingEvents(token);
  const { mutate: deleteEvent } = useDeleteEvent(token);

  const handleDelete = (id: number) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this event. This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete Event',
      cancelButtonText: 'Discard',
    }).then((result:any) => {
      if (result.isConfirmed) {
        deleteEvent(id);
        MySwal.fire('Deleted!', 'The event has been deleted.', 'success');
      }
    });
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/events/edit-event/${id}`);
   };

  useEffect(() => {
    if (!events.length && fetchedEvents) {
      dispatch(fetchEventsSuccess(fetchedEvents));
    } else if (fetchError) {
    }
  }, [dispatch, events.length, fetchedEvents, fetchError]);

  const skeletonRows = Array(events?.length || 5).fill(null);


  return (
    <div className="min-h-screen bg-white flex flex-col text-black">
      {/* Desktop Header */}
      <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-4">Events</h2>

        <h3 className="p-4 font-semibold ml-[-20px] md:ml-[0px]">Upcoming Events</h3>
        <div className="bg-white rounded-lg md:shadow overflow-hidden">
          <ul className='h-[100vh]'>
            {isFetching ? (
              skeletonRows?.map((_: any, index: any) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">
                    <Skeleton width={20} />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton width={150} />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton width={150} />
                  </td>
                </tr>
              ))

            ) : (
              <>
                {events?.map((event: any, index: number) => (
                  <li key={index} className="border-t border-gray-200">
                    <div className="flex items-center justify-between p-4 relative">
                      <Link href={`/dashboard/events/attendance/${event.id}`} passHref>
                        <div>
                          <h4 className="font-semibold">{event.EventName}</h4>
                          <p className="text-sm text-gray-500 mt-2">
                            {event.EventDate} {event.EventDay}
                          </p>
                        </div>
                      </Link>

                      <button
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => handleMoreClick(index)}
                      >
                        <MoreVertical className="h-5 w-5 text-gray-400" />
                      </button>

                      {selectedEvent === index && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 top-10 bg-white shadow-lg rounded-md p-2 z-[999]"
                        >
                          <button onClick={() => handleEdit(event.id)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(event.id)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </>
            )}


          </ul>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 ">
        <button onClick={() => setIsCreateOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg">
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg transition-transform transform ${isCreateOpen ? 'translate-y-0' : 'translate-y-full'
          } ease-out duration-300`}
        style={{ height: '100%' }}
      >
        <NewEvent onClose={() => setIsCreateOpen(false)} />
      </div>



      {/* Mobile Navigation */}
      <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  )
}

export default withAuth(ChurchEvents);
