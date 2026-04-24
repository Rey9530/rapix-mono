import { Component } from '@angular/core';

import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-custom-scrollspy',
  imports: [NgbScrollSpyModule, Card, SvgIcon],
  templateUrl: './custom-scrollspy.html',
  styleUrl: './custom-scrollspy.scss',
})
export class CustomScrollspy {}
