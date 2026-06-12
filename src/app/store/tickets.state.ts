import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AddTicketAction, RemoveTicketAction, UpdateTicketFilterAction, UpdateTicketStatusAction } from './tickets.actions';


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
    items: [
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
  ],
  filter: 'All',
  },
})
@Injectable()
export class TicketsState {
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
    const {items, filter} = state;
    
    if (filter === 'All') {
      return items;
    }

    return items.filter(item => item.status === filter);
  }

  @Action(AddTicketAction)
  add(ctx: StateContext<TicketsStateModel>, { payload }: AddTicketAction) {
    const stateModel = ctx.getState();
    ctx.patchState({ items: [...stateModel.items, payload] });
  }

  @Action(RemoveTicketAction)
  remove(ctx: StateContext<TicketsStateModel>, { payload }: RemoveTicketAction) {
    const stateModel = ctx.getState();
    ctx.patchState({ items: stateModel.items.filter(item => item.id !== payload) });
  }

  @Action(UpdateTicketStatusAction)
  updateStatus(ctx: StateContext<TicketsStateModel>, { payload }: UpdateTicketStatusAction) {
   const stateModel = ctx.getState();
   ctx.patchState({ items: stateModel.items.map(item => item.id === payload.id ? {...item, status: payload.newStatus} : item) })
  }

  @Action(UpdateTicketFilterAction)
  updateFilter(ctx: StateContext<TicketsStateModel>, { payload }: UpdateTicketFilterAction) {
    const stateModel = ctx.getState();
    ctx.patchState({ filter: payload })
  }
}
