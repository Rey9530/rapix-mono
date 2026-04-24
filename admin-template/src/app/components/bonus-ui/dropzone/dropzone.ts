import { Component } from '@angular/core';

import { MultipleFileUpload } from './widgets/multiple-file-upload/multiple-file-upload';
import { SingleFileUpload } from './widgets/single-file-upload/single-file-upload';

@Component({
  selector: 'app-dropzone',
  imports: [SingleFileUpload, MultipleFileUpload],
  templateUrl: './dropzone.html',
  styleUrl: './dropzone.scss',
})
export class Dropzone {}
