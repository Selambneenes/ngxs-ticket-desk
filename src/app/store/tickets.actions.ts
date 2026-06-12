import { TicketItem, TicketsStateModel } from "./tickets.state";

export class AddTicketAction {
  static readonly type = '[Tickets] Add item';
  constructor(readonly payload: TicketItem) {}
}

export class RemoveTicketAction {
  static readonly type = '[Tickets] Remove item';
  constructor(readonly payload: number) {}
}

export class UpdateTicketStatusAction {
  static readonly type = '[Tickets] Update status'
  constructor(readonly payload: { id: number; newStatus: TicketItem['status'] }) {}
}

export class UpdateTicketFilterAction {
  static readonly type = '[Tickets] Update filter'
  constructor(readonly payload: TicketsStateModel['filter']) {}
}