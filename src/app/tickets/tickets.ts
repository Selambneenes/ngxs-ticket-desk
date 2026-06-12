import { Component, inject, signal } from '@angular/core';
import { TicketItem } from './ticket-item/ticket-item';
import { ToastrService } from 'ngx-toastr';
import { TicketsState, TicketsStateModel } from '../store/tickets.state';
import { Store } from '@ngxs/store';
import { AddTicketAction, RemoveTicketAction, UpdateTicketFilterAction, UpdateTicketStatusAction } from '../store/tickets.actions';

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
  private store = inject(Store);
  private toastr = inject(ToastrService);

  /* Usage Signal */
 /*  private readonly tickets = signal<Ticket[]>([
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
  ]); */

  /* Usage NGXS */
  private readonly tickets = this.store.selectSignal(TicketsState.getFilteredItems);


  

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

    /*? Usage Signal */
    /*  this.tickets.update(currentTickets => currentTickets.filter(ticket => ticket.id !== id)); */

    /* Usage NGXS */
    this.store.dispatch(new RemoveTicketAction(id))

    
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

    /* Usage Signal */
    /*  this.tickets.update(currentTickets => [...currentTickets, newTicket]); */

    /* Usage NGXS */
    this.store.dispatch(new AddTicketAction(newTicket));

    this.toastr.success(`Ticket added successfully`);

  }

  updateStatus(id: number, newStatus: Ticket['status']) {
    /*? Usage Signal */
    /*  this.tickets.update(currentTickets => currentTickets.map(ticket => {
      if (ticket.id === id) {
        return {...ticket, status: newStatus}
      }

      return ticket;
    })) */

    /* Usage NGXS */
    this.store.dispatch(new UpdateTicketStatusAction({ id, newStatus}))


    this.toastr.success(`Ticket status updated to ${newStatus}`);
  }

  updateFilter(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

     if (!['All', 'Open', 'In Progress', 'Closed'].includes(value)) {
      console.log('Invalid status selected');
      this.toastr.error(`Invalid status selected`);
      return;
    }

    const correctTypeValue: TicketsStateModel['filter'] = value as TicketsStateModel['filter'];

    this.store.dispatch(new UpdateTicketFilterAction(correctTypeValue))

    this.toastr.success(`The ticket filter was successfully applied`);
  }
}
