import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { Card } from '../../../shared/components/ui/card/card';

@Component({
  selector: 'app-mde-editor',
  imports: [AngularEditorModule, FormsModule, Card],
  templateUrl: './mde-editor.html',
  styleUrl: './mde-editor.scss',
})
export class MdeEditor {
  public htmlContent = '';
}
