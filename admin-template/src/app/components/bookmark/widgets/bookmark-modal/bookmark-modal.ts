import {
  Component,
  TemplateRef,
  output,
  inject,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  ModalDismissReasons,
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';

import {
  bookmarkCollection,
  bookmarkTags,
  bookmarks,
} from '../../../../shared/data/bookmark';
import { IBookmark } from '../../../../shared/interface/bookmark';

@Component({
  selector: 'app-bookmark-modal',
  imports: [ReactiveFormsModule, Select2Module],
  providers: [NgbActiveModal],
  templateUrl: './bookmark-modal.html',
  styleUrl: './bookmark-modal.scss',
})
export class BookmarkModal {
  private modalService = inject(NgbModal);

  readonly newBookmark = output<IBookmark>();

  readonly bookmarkModal = viewChild<TemplateRef<string>>('bookmarkModal');

  public bookmarkForm = new FormGroup({
    url: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    tag: new FormControl('', [Validators.required]),
    collection: new FormControl('', [Validators.required]),
  });

  public bookmarkDetails: IBookmark;
  public bookmarkTags = bookmarkTags;
  public bookmarkCollection = bookmarkCollection;
  public bookmarks = bookmarks;
  public closeResult: string;
  public modalOpen: boolean = false;

  async openModal(bookmark?: IBookmark) {
    this.modalOpen = true;
    if (bookmark) {
      this.bookmarkDetails = bookmark;

      this.bookmarkForm.patchValue({
        url: this.bookmarkDetails.url || '',
        title: this.bookmarkDetails.title || '',
        description: this.bookmarkDetails.description || '',
        tag: this.bookmarkDetails.tag || '',
        collection: this.bookmarkDetails.collection || '',
      });
    }

    this.modalService
      .open(this.bookmarkModal(), {
        ariaLabelledBy: 'bookmark-Modal',
        windowClass: 'theme-modal modal-lg',
      })
      .result.then(
        (result) => {
          `Result ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  submit() {
    this.bookmarkForm.markAllAsTouched();

    if (this.bookmarkForm.valid) {
      if (this.bookmarkDetails) {
        const index = bookmarks.findIndex(
          (bookmark) => bookmark.id == this.bookmarkDetails.id,
        );

        if (index !== -1) {
          bookmarks[index] = {
            ...bookmarks[index],
            url: this.bookmarkForm.value.url!,
            title: this.bookmarkForm.value.title!,
            description: this.bookmarkForm.value.description!,
            tag: this.bookmarkForm.value.tag!,
            collection: this.bookmarkForm.value.collection!,
          };
        }
      } else {
        const bookmark = {
          id: bookmarks.length + 1,
          url: this.bookmarkForm.value.url!,
          title: this.bookmarkForm.value.title!,
          description: this.bookmarkForm.value.description!,
          image: 'assets/images/lightgallery/01.jpg',
          tag: this.bookmarkForm.value.tag!,
          collection: this.bookmarkForm.value.collection!,
          is_favorite: false,
        };
        this.newBookmark.emit(bookmark);
      }

      this.modalService.dismissAll();
      this.bookmarkForm.reset();
    }
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
}
