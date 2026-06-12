import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Ticket } from '../tickets';

@Component({
  selector: 'app-ticket-item',
  imports: [],
  templateUrl: './ticket-item.html',
  styleUrl: './ticket-item.css',
})
export class TicketItem {
  @Input() ticket!: Ticket;
  @Output() removeTicket = new EventEmitter<number>();
  @Output() updateStatus = new EventEmitter<{ id: number; newStatus: Ticket['status'] }>();

  onStatusChange($event: Event) {
    const select = $event.target as HTMLSelectElement;
    const value = select.value;

    if (value === this.ticket.status || !['Open', 'In Progress', 'Closed'].includes(value)) {
      console.log('Invalid status selected');
      return;
    }

    const correctTypeValue: Ticket['status'] = value as Ticket['status'];

    this.updateStatus.emit({ id: this.ticket.id, newStatus: correctTypeValue });
    console.log(`Status updated for ticket ${this.ticket.id}: ${value}`);
  }
}