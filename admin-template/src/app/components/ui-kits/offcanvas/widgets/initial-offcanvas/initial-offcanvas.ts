import { Component, TemplateRef, inject } from '@angular/core';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';

@Component({
  selector: 'app-initial-offcanvas',
  imports: [Card, FeatherIcon],
  templateUrl: './initial-offcanvas.html',
  styleUrl: './initial-offcanvas.scss',
})
export class InitialOffcanvas {
  private offcanvasService = inject(NgbOffcanvas);

  open(content: TemplateRef<unknown>) {
    this.offcanvasService.open(content, { panelClass: 'common-offcanvas' });
  }
}
