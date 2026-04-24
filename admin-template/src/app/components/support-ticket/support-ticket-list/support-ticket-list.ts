import { Component } from '@angular/core';

import { ticketListStatus } from '../../../shared/data/support-ticket';

@Component({
  selector: 'app-support-ticket-list',
  imports: [],
  templateUrl: './support-ticket-list.html',
  styleUrl: './support-ticket-list.scss',
})
export class SupportTicketList {
  public ticketListStatus = ticketListStatus;
}
