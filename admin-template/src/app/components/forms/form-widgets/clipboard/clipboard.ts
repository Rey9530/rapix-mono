import { Component } from '@angular/core';

import { ClipboardOnParagraph } from './clipboard-on-paragraph/clipboard-on-paragraph';
import { ClipboardOnTextInput } from './clipboard-on-text-input/clipboard-on-text-input';
import { ClipboardOnTextarea } from './clipboard-on-textarea/clipboard-on-textarea';
import { CopyPortionFromParagraph } from './copy-portion-from-paragraph/copy-portion-from-paragraph';

@Component({
  selector: 'app-clipboard',
  imports: [
    ClipboardOnParagraph,
    ClipboardOnTextInput,
    ClipboardOnTextarea,
    CopyPortionFromParagraph,
  ],
  templateUrl: './clipboard.html',
  styleUrl: './clipboard.scss',
})
export class Clipboard {}
