import { Routes } from '@angular/router';
import { Tickets } from './tickets/tickets';
import { Overview } from './overview/overview';
import { Test } from './test/test';

export const routes: Routes = [
  {
    path: '',
    component: Tickets,
    title: 'Tickets Page'
  },
  {
    path: 'overview',
    component: Overview,
    title: 'Overview Page'
  },
   {
    path: 'test',
    component: Test,
    title: 'Test Page'
  },
];
