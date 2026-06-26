import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketItem } from '../store/tickets.state';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private http = inject(HttpClient);
  private apiUrl = "/api/v1/tickets";
  
  getTickets(): Observable<TicketItem[]> {
    return this.http.get<TicketItem[]>(this.apiUrl)
  }

  addTicket(ticket: { title: string, description: string }): Observable<TicketItem> {
    return this.http.post<TicketItem>(this.apiUrl, ticket)
  }

  updateTicketStatus(id: number, newStatus: TicketItem['status']): Observable<TicketItem> {
    return this.http.patch<TicketItem>(`${this.apiUrl}/${id}`, { status: newStatus })
  }

  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
