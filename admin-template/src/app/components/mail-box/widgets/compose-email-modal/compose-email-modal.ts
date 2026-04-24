import { Component, inject } from '@angular/core';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-compose-email-modal',
  imports: [AngularEditorModule],
  templateUrl: './compose-email-modal.html',
  styleUrl: './compose-email-modal.scss',
})
export class ComposeEmailModal {
  private modal = inject(NgbActiveModal);

  public fields = {
    cc: false,
    bcc: false,
  };

  handleFields(value: string) {
    this.fields[value as 'cc' | 'bcc'] = !this.fields[value as 'cc' | 'bcc'];
  }

  closeModal() {
    this.modal.close();
  }
}
