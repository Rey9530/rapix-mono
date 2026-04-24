import { Component, input, output } from '@angular/core';

import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintModule } from 'ngx-print';

import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';
import { IEmails } from '../../../../shared/interface/email';

@Component({
  selector: 'app-mail-details',
  imports: [
    AngularEditorModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgxPrintModule,
    SvgIcon,
    FeatherIcon,
  ],
  templateUrl: './mail-details.html',
  styleUrl: './mail-details.scss',
})
export class MailDetails {
  readonly mailDetails = input<IEmails>();
  readonly isMailOpen = output<boolean>();

  getUserText(userName: string): string {
    let names = userName.split(' ');
    return names.map((name) => name[0]).join('');
  }

  getTextColor(name: string) {
    let firstLetter = name[0];

    if (firstLetter >= 'A' && firstLetter <= 'M') {
      return 'primary';
    } else {
      return 'success';
    }
  }

  goPrevious() {
    this.isMailOpen.emit(false);
  }

  addToFavorite(email: IEmails) {
    email.is_favorite = !email.is_favorite;
  }

  print() {
    window.print();
  }
}
