import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { TicketsState, TicketsStateModel } from './tickets.state';
import { AddTicketAction } from './tickets.actions';

describe('Tickets store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([TicketsState])],
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
    };
    store.dispatch(new TicketsAction({
          id: 1,
          title: 'Issue with login',
          description: 'Unable to login with correct credentials.',
          status: 'Open',
        }));
    const actual = store.selectSnapshot(TicketsState.getState);
    expect(actual).toEqual(expected);
  });
});
