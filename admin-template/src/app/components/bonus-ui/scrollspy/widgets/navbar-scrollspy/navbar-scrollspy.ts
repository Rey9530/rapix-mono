import { Component } from '@angular/core';

import {
  NgbDropdownModule,
  NgbScrollSpyModule,
} from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-navbar-scrollspy',
  imports: [NgbScrollSpyModule, NgbDropdownModule, Card],
  templateUrl: './navbar-scrollspy.html',
  styleUrl: './navbar-scrollspy.scss',
})
export class NavbarScrollspy {}
