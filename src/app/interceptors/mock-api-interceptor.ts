import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { TicketItem } from '../store/tickets.state';

// In-memory data store to persist changes during local run
let mockTickets: TicketItem[] = [
  {
    id: 1,
    title: 'Issue with login',
    description: 'Unable to login with correct credentials.',
    status: 'Open',
  },
  {
    id: 2,
    title: 'Page not loading',
    description: 'The dashboard page is not loading properly.',
    status: 'In Progress',
  },
  {
    id: 3,
    title: 'Error in payment processing',
    description: 'Payment fails with an error message.',
    status: 'Closed',
  },
];

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseApiUrl: string = '/api/v1';
  const url = req.url;
  const method = req.method;

  // 1. GET /api/v1/tickets -> Get all tickets
  if (url === `${baseApiUrl}/tickets` && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: [...mockTickets] })).pipe(delay(500));
  }

  // 2. POST /api/v1/tickets -> Create new ticket
  if (url === `${baseApiUrl}/tickets` && method === 'POST') {
    const body = req.body as { title: string, description: string };
    const newTicket: TicketItem = {
      id: mockTickets.length > 0 ? Math.max(...mockTickets.map(t => t.id)) + 1 : 1,
      title: body.title,
      description: body.description,
      status: 'Open'
    };

    mockTickets = [...mockTickets, newTicket];
    return of(new HttpResponse({ status: 201, body: newTicket })).pipe(delay(500));
  }

  // 3. PATCH /api/v1/tickets/:id -> Update ticket status
  if (url.startsWith(`${baseApiUrl}/tickets/`) && method === 'PATCH') {
    const id = parseInt(url.split('/').pop() || '0', 10);
    const body = req.body as Partial<TicketItem>;

    mockTickets = mockTickets.map(t => t.id === id ? { ...t, ...body } : t);
    const updated = mockTickets.find(t => t.id === id);

    if (updated) {
      return of(new HttpResponse({ status: 200, body: updated })).pipe(delay(500));
    }
    return of(new HttpResponse({ status: 404, body: { message: 'Ticket not found' } })).pipe(delay(500));
  }

  // 4. DELETE /api/v1/tickets/:id -> Delete ticket
  if (url.startsWith(`${baseApiUrl}/tickets/`) && method === 'DELETE') {
    const id = parseInt(url.split('/').pop() || '0', 10);
    mockTickets = mockTickets.filter(t => t.id !== id);

    return of(new HttpResponse({ status: 200, body: null })).pipe(delay(500));
  }

  // For other requests, pass through to the network
  return next(req);
};
