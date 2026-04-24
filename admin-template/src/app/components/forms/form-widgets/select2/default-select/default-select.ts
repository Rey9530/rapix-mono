import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TagInputModule } from 'ngx-chips';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-default-select',
  imports: [Card, TagInputModule, FormsModule],
  templateUrl: './default-select.html',
  styleUrl: './default-select.scss',
})
export class DefaultSelect {
  public defaultSelect = ['tag1', 'tag2', 'tag3', 'autofocus'];
}
