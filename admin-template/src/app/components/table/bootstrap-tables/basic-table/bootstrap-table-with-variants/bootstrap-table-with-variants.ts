import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { student } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-bootstrap-table-with-variants',
  imports: [Card],
  templateUrl: './bootstrap-table-with-variants.html',
  styleUrl: './bootstrap-table-with-variants.scss',
})
export class BootstrapTableWithVariants {
  public student = student;
}
