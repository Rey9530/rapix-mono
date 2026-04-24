import { Component, output } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';
import { emailTypes } from '../../../../shared/data/email';

@Component({
  selector: 'app-mail-header',
  imports: [NgbDropdownModule, SvgIcon],
  templateUrl: './mail-header.html',
  styleUrl: './mail-header.scss',
})
export class MailHeader {
  readonly emailType = output<string>();

  public emailTypes = emailTypes;
  public activeType: string = 'important';

  ngOnInit() {
    this.emailType.emit(this.activeType);
  }

  handleType(value: string) {
    this.activeType = value;
    this.emailType.emit(this.activeType);
  }
}
