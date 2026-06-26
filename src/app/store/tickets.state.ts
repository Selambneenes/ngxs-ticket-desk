import { Injectable, inject } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { GetTicketsAction, AddTicketAction, RemoveTicketAction, UpdateTicketFilterAction, UpdateTicketStatusAction } from './tickets.actions';
import { TicketService } from '../services/ticket.service';
import { tap } from 'rxjs/operators';

export type TicketItem = {
  id: number;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
};

export interface TicketsStateModel {
  items: TicketItem[];
  filter: 'All' | 'Open' | 'In Progress' | 'Closed';
}

@State<TicketsStateModel>({
  name: 'Tickets',
  defaults: {
    items: [],
    filter: 'All',
  },
})
@Injectable()
export class TicketsState {
  private ticketService = inject(TicketService);

  @Selector()
  static getState(state: TicketsStateModel) {
    return state;
  }

  @Selector()
  static getItems(state: TicketsStateModel) {
    return state.items;
  }

  @Selector()
  static getFilteredItems(state: TicketsStateModel) {
    const { items, filter } = state;

    if (filter === 'All') {
      return items;
    }

    return items.filter(item => item.status === filter);
  }

  @Action(GetTicketsAction)
  get(ctx: StateContext<TicketsStateModel>) {
    return this.ticketService.getTickets().pipe(
      tap((items) => {
        ctx.patchState({ items });
      })
    );
  }

  @Action(AddTicketAction)
  add(ctx: StateContext<TicketsStateModel>, { payload }: AddTicketAction) {
    return this.ticketService.addTicket(payload).pipe(
      tap((newTicket) => {
        const stateModel = ctx.getState();
        ctx.patchState({ items: [...stateModel.items, newTicket] });
      })
    );
  }

  @Action(RemoveTicketAction)
  remove(ctx: StateContext<TicketsStateModel>, { payload }: RemoveTicketAction) {
    return this.ticketService.deleteTicket(payload).pipe(
      tap(() => {
        const stateModel = ctx.getState();
        ctx.patchState({ items: stateModel.items.filter(item => item.id !== payload) });
      })
    );
  }

  @Action(UpdateTicketStatusAction)
  updateStatus(ctx: StateContext<TicketsStateModel>, { payload }: UpdateTicketStatusAction) {
    return this.ticketService.updateTicketStatus(payload.id, payload.newStatus).pipe(
      tap((updatedTicket) => {
        const stateModel = ctx.getState();
        ctx.patchState({
          items: stateModel.items.map(item => item.id === payload.id ? updatedTicket : item)
        });
      })
    );
  }

  @Action(UpdateTicketFilterAction)
  updateFilter(ctx: StateContext<TicketsStateModel>, { payload }: UpdateTicketFilterAction) {
    const stateModel = ctx.getState();
    ctx.patchState({ filter: payload })
  }
}
