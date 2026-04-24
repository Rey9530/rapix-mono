import { Component } from '@angular/core';

import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-nested-scrollspy',
  imports: [NgbScrollSpyModule, Card, SvgIcon],
  templateUrl: './nested-scrollspy.html',
  styleUrl: './nested-scrollspy.scss',
})
export class NestedScrollspy {}
