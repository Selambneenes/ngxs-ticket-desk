import { Component, inject, OnInit } from '@angular/core';
import { TicketItem } from './ticket-item/ticket-item';
import { ToastrService } from 'ngx-toastr';
import { TicketsState, TicketsStateModel } from '../store/tickets.state';
import { Store } from '@ngxs/store';
import { GetTicketsAction, AddTicketAction, RemoveTicketAction, UpdateTicketFilterAction, UpdateTicketStatusAction } from '../store/tickets.actions';

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
export class Tickets implements OnInit {
  private store = inject(Store);
  private toastr = inject(ToastrService);

  /* Usage NGXS */
  private readonly tickets = this.store.selectSignal(TicketsState.getFilteredItems);

  ngOnInit() {
    this.store.dispatch(new GetTicketsAction());
  }

  allTickets() {
    return this.tickets();
  }

  removeTicket(id: number) {
    console.log(`Removing ticket with id: ${id}`);

    /* Usage NGXS */
    this.store.dispatch(new RemoveTicketAction(id))

    this.toastr.info(`Ticket removed successfully`);
  }

  addTicket(title: string, description: string) {
    if (!title.trim() || !description.trim()) {
      this.toastr.error('Title and description cannot be empty');
      return;
    }

    /* Usage NGXS */
    this.store.dispatch(new AddTicketAction({ title, description }));

    this.toastr.success(`Ticket added successfully`);
  }

  updateStatus(id: number, newStatus: Ticket['status']) {
    /* Usage NGXS */
    this.store.dispatch(new UpdateTicketStatusAction({ id, newStatus }))

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
