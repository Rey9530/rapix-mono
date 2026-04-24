import { Component } from '@angular/core';

import { SupportTicketDataTable } from './support-ticket-data-table/support-ticket-data-table';
import { SupportTicketList } from './support-ticket-list/support-ticket-list';

@Component({
  selector: 'app-support-ticket',
  imports: [SupportTicketList, SupportTicketDataTable],
  templateUrl: './support-ticket.html',
  styleUrl: './support-ticket.scss',
})
export class SupportTicket {}
