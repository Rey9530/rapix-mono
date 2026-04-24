import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Editor, NgxEditorModule } from 'ngx-editor';

import { Card } from '../../../shared/components/ui/card/card';

@Component({
  selector: 'app-ngx-editor',
  imports: [FormsModule, NgxEditorModule, Card],
  templateUrl: './ngx-editor.html',
  styleUrl: './ngx-editor.scss',
})
export class NgxEditor {
  public editor: Editor;
  public html = '';

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
