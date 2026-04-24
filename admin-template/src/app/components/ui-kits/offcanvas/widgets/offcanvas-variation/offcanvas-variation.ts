import { Component, inject } from '@angular/core';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { ProjectForm } from '../project-form/project-form';

@Component({
  selector: 'app-offcanvas-variation',
  imports: [Card],
  templateUrl: './offcanvas-variation.html',
  styleUrl: './offcanvas-variation.scss',
})
export class OffcanvasVariation {
  private offcanvasService = inject(NgbOffcanvas);

  public title: string = '';

  openScrolling() {
    const offcanvasRef = this.offcanvasService.open(ProjectForm, {
      scroll: true,
      backdrop: false,
      keyboard: false,
      panelClass: 'common-offcanvas',
    });
    offcanvasRef.componentInstance.title = 'Offcanvas Body Scrolling';
  }

  openBackdropScrolling() {
    const offcanvasRef = this.offcanvasService.open(ProjectForm, {
      scroll: true,
      panelClass: 'common-offcanvas',
    });
    offcanvasRef.componentInstance.title = 'Backdrop with Scrolling';
  }

  openStatic() {
    const offcanvasRef = this.offcanvasService.open(ProjectForm, {
      backdrop: 'static',
      keyboard: false,
      panelClass: 'common-offcanvas',
    });
    offcanvasRef.componentInstance.title = 'Static Offcanvas';
  }
}
