import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { TicketsState, TicketsStateModel } from './tickets.state';
import { AddTicketAction } from './tickets.actions';
import { TicketService } from '../services/ticket.service';
import { of } from 'rxjs';

describe('Tickets store', () => {
  let store: Store;
  let ticketServiceMock: any;

  beforeEach(() => {
    ticketServiceMock = {
      addTicket: (ticket: any) => of({ id: 1, title: ticket.title, description: ticket.description, status: 'Open' })
    };

    TestBed.configureTestingModule({
      providers: [
        provideStore([TicketsState]),
        { provide: TicketService, useValue: ticketServiceMock }
      ],
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: TicketsStateModel = {
      items: [
        {
          id: 1,
          title: 'Issue with login',
          description: 'Unable to login with correct credentials.',
          status: 'Open',
        }
      ],
      filter: 'All'
    };
    store.dispatch(new AddTicketAction({
      title: 'Issue with login',
      description: 'Unable to login with correct credentials.',
    }));
    const actual = store.selectSnapshot(TicketsState.getState);
    expect(actual).toEqual(expected);
  });
});
