import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Event {
    id: number;
    name: string;
    type: string;
    leader: string;
    time: string;
    date: string;
    churchID: string;
}

interface EventState {
    isLoading: boolean;
    events: Event[];
    error: string | null;
}

const initialState: EventState = {
    isLoading: false,
    events: [],
    error: null,
};

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        fetchEventsRequest(state) {
            state.isLoading = true;
        },
        fetchEventsSuccess(state, action: PayloadAction<Event[]>) {
            console.log("from redux", action.payload)

            state.isLoading = false;
            state.events = action.payload;
            state.error = null;
        },
        fetchEventsFailure(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload;
        },
        addEvents(state, action: PayloadAction<Event>) {
            console.log("from s tore", action.payload)
            state.events.push(action.payload);
        },
        deleteEvent(state, action: PayloadAction<number>) {
            state.events = state.events.filter(event => event.id !== action.payload);
        },
    },
});

export const { fetchEventsRequest, fetchEventsSuccess, fetchEventsFailure, addEvents, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
