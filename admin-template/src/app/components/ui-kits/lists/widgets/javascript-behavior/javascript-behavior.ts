import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-javascript-behavior',
  imports: [NgbNavModule, Card],
  templateUrl: './javascript-behavior.html',
  styleUrl: './javascript-behavior.scss',
})
export class JavascriptBehavior {
  public active = 'home';
}
