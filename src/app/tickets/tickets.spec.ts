import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tickets } from './tickets';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { GetTicketsAction, AddTicketAction, RemoveTicketAction, UpdateTicketStatusAction, UpdateTicketFilterAction } from '../store/tickets.actions';
import { TicketsState } from '../store/tickets.state';

describe('Tickets Component', () => {
  let component: Tickets;
  let fixture: ComponentFixture<Tickets>;
  let mockStore: any;
  let mockToastr: any;
  let mockTicketsSignal: any;

  beforeEach(async () => {
    mockTicketsSignal = signal([
      { id: 1, title: 'Test Ticket 1', description: 'Description 1', status: 'Open' },
      { id: 2, title: 'Test Ticket 2', description: 'Description 2', status: 'In Progress' }
    ]);

    mockStore = {
      selectSignal: vi.fn().mockReturnValue(mockTicketsSignal),
      dispatch: vi.fn()
    };

    mockToastr = {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Tickets],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: ToastrService, useValue: mockToastr }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tickets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tickets on init', () => {
    expect(mockStore.dispatch).toHaveBeenCalledWith(expect.any(GetTicketsAction));
  });

  it('should return all tickets from the store signal', () => {
    const tickets = component.allTickets();
    expect(tickets).toEqual(mockTicketsSignal());
    expect(mockStore.selectSignal).toHaveBeenCalledWith(TicketsState.getFilteredItems);
  });

  it('should dispatch AddTicketAction and show success toast when adding a valid ticket', () => {
    component.addTicket('New Ticket', 'New Description');
    expect(mockStore.dispatch).toHaveBeenCalledWith(expect.any(AddTicketAction));
    expect(mockToastr.success).toHaveBeenCalledWith('Ticket added successfully');
  });

  it('should NOT dispatch AddTicketAction and show error toast when title or description is empty', () => {
    component.addTicket('  ', 'New Description');
    expect(mockStore.dispatch).not.toHaveBeenCalledWith(expect.any(AddTicketAction));
    expect(mockToastr.error).toHaveBeenCalledWith('Title and description cannot be empty');

    mockToastr.error.mockClear();

    component.addTicket('New Ticket', '');
    expect(mockStore.dispatch).not.toHaveBeenCalledWith(expect.any(AddTicketAction));
    expect(mockToastr.error).toHaveBeenCalledWith('Title and description cannot be empty');
  });

  it('should dispatch RemoveTicketAction and show info toast when removing a ticket', () => {
    component.removeTicket(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expect.any(RemoveTicketAction));
    expect(mockToastr.info).toHaveBeenCalledWith('Ticket removed successfully');
  });

  it('should dispatch UpdateTicketStatusAction and show success toast when updating status', () => {
    component.updateStatus(1, 'Closed');
    expect(mockStore.dispatch).toHaveBeenCalledWith(expect.any(UpdateTicketStatusAction));
    expect(mockToastr.success).toHaveBeenCalledWith('Ticket status updated to Closed');
  });

  it('should dispatch UpdateTicketFilterAction and show success toast when selecting a valid filter', () => {
    const mockEvent = {
      target: {
        value: 'Closed'
      }
    } as unknown as Event;

    component.updateFilter(mockEvent);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expect.any(UpdateTicketFilterAction));
    expect(mockToastr.success).toHaveBeenCalledWith('The ticket filter was successfully applied');
  });

  it('should NOT dispatch UpdateTicketFilterAction and show error toast when selecting an invalid filter', () => {
    const mockEvent = {
      target: {
        value: 'InvalidFilter'
      }
    } as unknown as Event;

    component.updateFilter(mockEvent);
    expect(mockStore.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateTicketFilterAction));
    expect(mockToastr.error).toHaveBeenCalledWith('Invalid status selected');
  });
});
