import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TagInputModule } from 'ngx-chips';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-disabled-readonly',
  imports: [Card, TagInputModule, FormsModule],
  templateUrl: './disabled-readonly.html',
  styleUrl: './disabled-readonly.scss',
})
export class DisabledReadonly {
  public readonly = ['tag1', 'tag2', 'tag3'];
}
