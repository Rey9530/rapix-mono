import { Component, inject } from '@angular/core';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { DeleteFileModal } from './delete-file-modal/delete-file-modal';
import { FileModal } from './file-modal/file-modal';
import { Card } from '../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';
import { fileFormats, files } from '../../../../shared/data/fileManager';
import { IFiles } from '../../../../shared/interface/fileManager';

@Component({
  selector: 'app-files',
  imports: [Card, NgbModule, SvgIcon, Card],
  templateUrl: './files.html',
  styleUrl: './files.scss',
})
export class Files {
  private toastr = inject(ToastrService);
  private modalService = inject(NgbModal);

  public files: IFiles[] = files;
  public allFiles = files;
  public fileFormats = fileFormats;
  public location: string = 'root';
  public currentFolder: IFiles | null = null;
  public folders: IFiles[] = [];
  public forwardStack: IFiles[] = [];
  public selected: IFiles | null = null;
  public isSubFolder = false;

  constructor() {}

  openModal(title: string, type: string) {
    if (type == 'rename' && !this.selected) {
      this.toastr.error(
        'Kindly choose a file or folder that you like to change its name!',
        '',
        {
          positionClass: 'toast-bottom-right',
        },
      );
    } else {
      const modalRef = this.modalService.open(FileModal, {
        modalDialogClass: 'file-modal',
        centered: true,
      });
      // Send title, file details to the modal
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.type =
        type === 'rename' ? this.selected?.type : type;
      modalRef.componentInstance.file = this.selected;
      modalRef.componentInstance.rename_file = type === 'rename';

      modalRef.result.then((result) => {
        if (type == 'rename') {
          // Update file/folder name
          const folder = this.files.find(
            (file) => file.id === this.selected?.id,
          );
          if (folder) {
            folder.name = result.file_name;

            if (this.selected && this.selected.type == 'file') {
              ((folder.type = result.file_type),
                (folder.text = this.getFileText(
                  result.file_name,
                  this.selected.type,
                )));
            }
          }
        } else {
          // Add file/folder
          if (result && result.file_name) {
            const newFile: IFiles = {
              id: this.getFileId(),
              name: result.file_name,
              type: result.file_type,
              text: this.getFileText(result.file_name, type),
            };

            // Add parent id into sub folder
            if (
              newFile &&
              newFile.type == 'folder' &&
              this.location !== 'root'
            ) {
              newFile.parent_id = this.currentFolder?.id;
            }

            // Add file/folder into sub folder
            if (this.currentFolder && this.location !== 'root') {
              if (!this.currentFolder.children) {
                this.currentFolder.children = [];
              }
              this.currentFolder.children.push(newFile);
              this.files = [...this.currentFolder.children];
            }
            // Add file/folder into root location
            else if (newFile && this.files) {
              this.files.push(newFile);
              this.allFiles = this.files;
            }
          }
        }
      });
    }
  }

  deleteModal() {
    if (!this.selected) {
      this.toastr.error(
        'Please select a file or folder which you want to delete!',
        '',
        {
          positionClass: 'toast-bottom-right',
        },
      );
    } else {
      const modalRef = this.modalService.open(DeleteFileModal);

      modalRef.result.then((result) => {
        if (result && this.selected) {
          this.files.splice(this.files.indexOf(this.selected), 1);

          this.folders = this.folders.filter(
            (folder) => folder !== this.selected,
          );
          this.forwardStack = this.forwardStack.filter(
            (folder) => folder !== this.selected,
          );

          this.selected = null;
        }
      });
    }
  }

  // Get max id from all files
  getFileId(): number {
    let maxId = 0;

    const getId = (items: IFiles[]) => {
      for (const item of items) {
        if (item.id > maxId) {
          maxId = item.id;
        }

        if (item.children && item.children.length > 0) {
          getId(item.children);
        }
      }
    };

    getId(this.allFiles);
    return maxId + 1;
  }

  // Get file text based on file type
  getFileText(name: string, type: string): string {
    if (type !== 'file') return '';

    const fileName = name.toLowerCase();
    const fileFormat = fileFormats.find((ext) => fileName.endsWith(ext));

    return fileFormat ? fileFormat.replace('.', '').toUpperCase() : 'TXT';
  }

  openFolder(id: number) {
    this.selected = null;

    const folder = this.files.find((file) => file.id === id);
    if (folder) {
      this.folders.push(folder);
      this.currentFolder = folder;
      this.forwardStack = [];
      this.isSubFolder = true;

      this.files = folder.children || [];
      this.location += '/' + folder.name;
    }
  }

  navigate(direction: 'back' | 'next') {
    if (direction === 'back') {
      if (this.folders.length > 1) {
        const last = this.folders.pop();
        if (last) this.forwardStack.push(last);

        const previous = this.folders[this.folders.length - 1];
        this.currentFolder = previous;
        this.files = previous.children || [];
      } else {
        if (this.currentFolder) {
          this.forwardStack.push(this.currentFolder);
        }
        this.goHome();
        return;
      }
    } else if (direction === 'next') {
      if (this.forwardStack.length > 0) {
        const nextFolder = this.forwardStack.pop();
        if (nextFolder) {
          this.folders.push(nextFolder);
          this.currentFolder = nextFolder;
          this.files = nextFolder.children || [];
        }
      }
    }

    // Common to both directions
    this.location =
      'root' + this.folders.map((folder) => '/' + folder.name).join('');
    this.isSubFolder = true;
  }

  goHome() {
    this.location = 'root';
    this.files = this.allFiles;
    this.folders = [];
    this.currentFolder = null;
    this.isSubFolder = false;
  }

  select(file: IFiles) {
    this.selected = file;
  }
}
