import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketItem } from './ticket-item';

describe('TicketItem', () => {
  let component: TicketItem;
  let fixture: ComponentFixture<TicketItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketItem],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketItem);
    component = fixture.componentInstance;
    
    // Set required input property before first change detection
    component.ticket = {
      id: 1,
      title: 'Test Ticket',
      description: 'Test Description',
      status: 'Open'
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
