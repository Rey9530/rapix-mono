import { Component, output } from '@angular/core';

@Component({
  selector: 'app-contact-history',
  imports: [],
  templateUrl: './contact-history.html',
  styleUrl: './contact-history.scss',
})
export class ContactHistory {
  readonly history = output<boolean>();

  closeHistory() {
    this.history.emit(false);
  }
}
