import { SafeHtml } from '@angular/platform-browser';

export interface IAPI {
  id: number;
  api_name: string;
  api_key: SafeHtml;
  status: string;
}
