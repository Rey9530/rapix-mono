import { Component, inject, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { fileFormats } from '../../../../../shared/data/fileManager';
import { IFiles } from '../../../../../shared/interface/fileManager';

@Component({
  selector: 'app-file-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './file-modal.html',
  styleUrl: './file-modal.scss',
})
export class FileModal {
  public activeModal = inject(NgbActiveModal);

  @Input() title: string = '';
  @Input() type: string = 'file';
  @Input() file: IFiles;
  @Input() rename_file: boolean = false;

  public fileFormats = fileFormats;

  public fileForm = new FormGroup({
    file_name: new FormControl('', [Validators.required]),
    file_type: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.fileForm.get('file_type')?.setValue(this.type);

    if (this.rename_file && this.file) {
      this.fileForm.get('file_name')?.setValue(this.file.name);
    }
  }

  submit() {
    this.fileForm.markAllAsTouched();

    if (this.fileForm.valid) {
      if (this.type === 'file') {
        let filename = this.fileForm.value.file_name || '';

        if (filename.includes('.')) {
          const ext = filename
            .substring(filename.lastIndexOf('.'))
            .toLowerCase();
          if (!this.fileFormats.includes(ext)) {
            this.fileForm.get('file_name')?.setErrors({ invalidFormat: true });
            return;
          }
        } else {
          filename += '.txt';
          this.fileForm.get('file_name')?.setValue(filename);
        }
      }

      this.activeModal.close(this.fileForm.value);
    }
  }
}
