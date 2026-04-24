import { SafeHtml } from '@angular/platform-browser';

export interface ISupportDB {
  id: number;
  img: string;
  name: string;
  position: string;
  salary: string;
  office: string;
  skill: string;
  progress: SafeHtml;
  extn: number;
  email: string;
}

export interface ITicketListStatus {
  status_title: string;
  order: string;
  profit: number;
  loss: number;
  level: string;
  level_color: string;
}
