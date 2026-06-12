import { Component, signal } from '@angular/core';
import { Header } from "./components/header/header";
import { Tickets } from "./tickets/tickets";


@Component({
  selector: 'app-root',
  imports: [Header, Tickets],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ngxs-ticket-desk');
}
