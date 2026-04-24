import { Component } from '@angular/core';

import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-multiple-file-upload',
  imports: [DropzoneModule, Card],
  templateUrl: './multiple-file-upload.html',
  styleUrl: './multiple-file-upload.scss',
})
export class MultipleFileUpload {
  public text =
    '<h6>Drop files here or click to upload.</h6><span class="note needsclick">(This is just a demo dropzone. Selected files are <strong>not</strong> actually uploaded.)</span>';

  public config: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    addRemoveLinks: true,
  };
}
