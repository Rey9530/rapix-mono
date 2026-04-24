import { Component, inject } from '@angular/core';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { ProjectForm } from '../project-form/project-form';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-offcanvas-direction',
  imports: [Card],
  templateUrl: './offcanvas-direction.html',
  styleUrl: './offcanvas-direction.scss',
})
export class OffcanvasDirection {
  private offcanvasService = inject(NgbOffcanvas);

  public title: string = '';

  openTop() {
    const offcanvasRef = this.offcanvasService.open(UserForm, {
      position: 'top',
      panelClass: 'common-offcanvas',
    });
    offcanvasRef.componentInstance.title = 'Offcanvas Top';
  }

  openRight() {
    const offcanvasRef = this.offcanvasService.open(ProjectForm, {
      position: 'end',
      panelClass: 'common-offcanvas',
    });
    offcanvasRef.componentInstance.title = 'Offcanvas Right';
  }

  openBottom() {
    const offcanvasRef = this.offcanvasService.open(UserForm, {
      position: 'bottom',
      panelClass: 'common-offcanvas',
    });
    offcanvasRef.componentInstance.title = 'Offcanvas Bottom';
  }

  openLeft() {
    const offcanvasRef = this.offcanvasService.open(ProjectForm, {
      position: 'start',
      panelClass: 'common-offcanvas',
    });
    offcanvasRef.componentInstance.title = 'Offcanvas Left';
  }
}
