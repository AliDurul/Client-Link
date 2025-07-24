
import { createAppSlice } from "@/lib/createAppSlice";
import { getAllTickets } from "./ticketAPI";
import { ApiResponse, EscalationForm, Pagination, Ticket, TicketClientPhoneNumber, TicketComments } from "@/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createApiThunk, createAsyncThunkConfig } from "../shared/sliceUtils";


export interface DefaultTicketParams {
    title: string;
    description: string;
    client_phonenumber: TicketClientPhoneNumber | number | null
    caller_phonenumber: string | null;
    email_id: string | null;
    caller_email: string | TicketClientPhoneNumber | null;
    flag: string;
    cat: number;
    priority: string;
    status: string;
    ticket_id?: string
    timestamp?: string
    last_updated?: string
    escalation: null | EscalationForm
    assigned_agent: { id: string; first_name: string; last_name: string; };
}

export interface TicketSliceState {
    tickets: Pagination<Ticket>;
    ticket: Ticket | DefaultTicketParams;
    status: "idle" | "loading" | "failed";
    error: string | null;
    ticketModal: boolean;
    isEscalation: boolean;
    ticketComments: TicketComments;
    escalation: null | EscalationForm
}

export const initialTicket: DefaultTicketParams = {
    title: "",
    description: "",
    client_phonenumber: null,
    caller_phonenumber: null,
    caller_email: null,
    email_id: null,
    flag: "",
    cat: 0,
    priority: "",
    status: "",
    escalation: null,
    assigned_agent: { id: "", first_name: "", last_name: "" }
};

const initialState: TicketSliceState = {
    tickets: {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    status: "idle",
    error: null,
    ticketModal: false,
    isEscalation: false,
    escalation: null,
    ticketComments: { id: "", title: "", comments: [] },
    ticket: initialTicket,
};

export const ticketSlice = createAppSlice({
    name: 'ticket',
    initialState,
    reducers: (create) => ({
        // Collection management
        updateTickets: create.reducer((state, action: PayloadAction<Ticket[]>) => {
            state.status = 'idle';
            state.tickets.results = action.payload;
        }),

        // Entity management
        setTicket: create.reducer((state, action: PayloadAction<Ticket | DefaultTicketParams>) => {
            state.status = 'idle';
            state.ticket = action.payload;
        }),
        clearTicket: create.reducer((state) => {
            state.ticket = initialTicket;
        }),

        // Comments management
        updateTicketComments: create.reducer((state, action: PayloadAction<TicketComments>) => {
            state.status = 'idle';
            state.ticketComments = action.payload;
        }),

        // Modal management
        setTicketModal: create.reducer((state, action: PayloadAction<boolean>) => {
            state.status = 'idle';
            state.ticketModal = action.payload;
        }),
        toggleTicketModal: create.reducer((state) => {
            state.ticketModal = !state.ticketModal;
        }),

        // Escalation management
        setEscalation: create.reducer((state, action: PayloadAction<boolean>) => {
            state.status = 'idle';
            state.isEscalation = action.payload;
        }),
        toggleEscalation: create.reducer((state) => {
            state.isEscalation = !state.isEscalation;
        }),

        // Async actions
        fetchAllTicketAsync: create.asyncThunk(
            async (params: { page?: string, pageSize?: string }) => {
                return createApiThunk(
                    () => getAllTickets(null, params.page, params.pageSize),
                    "Failed to fetch tickets"
                );
            },
            createAsyncThunkConfig('tickets')
        ),
    }),
    selectors: {
        selectTickets: (ticket) => ticket.tickets,
        selectTicket: (ticket) => ticket.ticket,
        selectTicketState: (ticket) => ticket,
        selectTicketModal: (ticket) => ticket.ticketModal,
        selectIsEscalation: (ticket) => ticket.isEscalation,
        selectTicketComments: (ticket) => ticket.ticketComments,
        selectTicketStatus: (ticket) => ticket.status,
        selectTicketError: (ticket) => ticket.error,
    }
});

export const {
    fetchAllTicketAsync,
    updateTickets,
    setTicket,
    clearTicket,
    setTicketModal,
    toggleTicketModal,
    updateTicketComments,
    setEscalation,
    toggleEscalation
} = ticketSlice.actions;

export const {
    selectTickets,
    selectTicket,
    selectTicketState,
    selectTicketModal,
    selectIsEscalation,
    selectTicketComments,
    selectTicketStatus,
    selectTicketError
} = ticketSlice.selectors;
