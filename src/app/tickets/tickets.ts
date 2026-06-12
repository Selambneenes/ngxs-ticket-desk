import { Component, signal } from '@angular/core';
import { TicketItem } from './ticket-item/ticket-item';

export type Ticket = {
  id: number;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
};

@Component({
  selector: 'app-tickets',
  imports: [TicketItem],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets {
  private readonly tickets = signal<Ticket[]>([
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
  ]);


  

  
  allTickets() {
    console.log('Fetching all tickets', this.tickets());
    return this.tickets();
  }
}
