import { Component, inject, signal } from '@angular/core';
import { TicketItem } from './ticket-item/ticket-item';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);

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


  

  generateNewId(): number {
    const currentTickets = this.tickets();
    return currentTickets.length > 0 ? Math.max(...currentTickets.map(t => t.id)) + 1 : 1;
  }
  
  allTickets() {
    console.log('Fetching all tickets', this.tickets());
    return this.tickets();
  }

  removeTicket(id: number) {
    console.log(`Removing ticket with id: ${id}`);
    this.tickets.update(currentTickets => currentTickets.filter(ticket => ticket.id !== id));
    this.toastr.info(`Ticket removed successfully`);
  }

  addTicket(title: string, description: string) {
    if (!title.trim() || !description.trim()) {
      this.toastr.error('Title and description cannot be empty');
      return;
    }
    const newTicket: Ticket = {
      id: this.generateNewId(),
      title: title,
      description: description,
      status: 'Open',
    };
    this.tickets.update(currentTickets => [...currentTickets, newTicket]);
    this.toastr.success(`Ticket added successfully`);

  }

  updateStatus(id: number, newStatus: Ticket['status']) {
    this.tickets.update(currentTickets => currentTickets.map(ticket => {
      if (ticket.id === id) {
        return {...ticket, status: newStatus}
      }

      return ticket;
    }))

    this.toastr.success(`Ticket status updated to ${newStatus}`);
  }
}
