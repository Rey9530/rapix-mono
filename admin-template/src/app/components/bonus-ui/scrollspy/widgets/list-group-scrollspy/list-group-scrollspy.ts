import { Component } from '@angular/core';

import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-list-group-scrollspy',
  imports: [NgbScrollSpyModule, Card],
  templateUrl: './list-group-scrollspy.html',
  styleUrl: './list-group-scrollspy.scss',
})
export class ListGroupScrollspy {}
