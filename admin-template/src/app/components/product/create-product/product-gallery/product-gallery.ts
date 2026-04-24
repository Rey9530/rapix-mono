import { Component, input, output } from '@angular/core';

import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';

import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-product-gallery',
  imports: [DropzoneModule, SvgIcon],
  templateUrl: './product-gallery.html',
  styleUrl: './product-gallery.scss',
})
export class ProductGallery {
  readonly active = input<number>();

  readonly changeTab = output<number>();

  public text =
    ' <i class="fa-solid fa-cloud-arrow-up fa-fade"></i><h6>Drop files here or click to upload.</h6><span class="note needsclick">SVG,PNG,JPG <strong>or</strong> GIF</span>';

  public config: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    maxFilesize: 50,
    acceptedFiles: 'image/*',
    addRemoveLinks: true,
  };

  next() {
    const nextTab = (this.active() ?? 0) + 1;
    this.changeTab.emit(nextTab);
  }

  previous() {
    const prevTab = (this.active() ?? 1) - 1;
    this.changeTab.emit(prevTab);
  }
}
