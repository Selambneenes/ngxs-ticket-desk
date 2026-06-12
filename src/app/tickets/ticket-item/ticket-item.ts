import { Component, Input } from '@angular/core';
import { Ticket } from '../tickets';

@Component({
  selector: 'app-ticket-item',
  imports: [],
  templateUrl: './ticket-item.html',
  styleUrl: './ticket-item.css',
})
export class TicketItem {
  @Input() ticket!: Ticket; // 'any' yerine kendi Ticket tipini/arayüzünü yazabilirsin
}
