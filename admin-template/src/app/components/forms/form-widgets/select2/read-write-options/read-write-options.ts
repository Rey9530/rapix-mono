import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TagInputModule } from 'ngx-chips';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-read-write-options',
  imports: [TagInputModule, FormsModule, Card],
  templateUrl: './read-write-options.html',
  styleUrl: './read-write-options.scss',
})
export class ReadWriteOptions {
  public readonly = ['tag1', 'tag2', 'tag3'];
}
