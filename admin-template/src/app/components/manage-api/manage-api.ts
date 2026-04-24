import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { ManageApiModal } from './manage-api-modal/manage-api-modal';
import { Table } from '../../shared/components/ui/table/table';
import { APIs } from '../../shared/data/api';
import { IAPI } from '../../shared/interface/api';
import {
  ITableClickedAction,
  ITableConfigs,
} from '../../shared/interface/common';

@Component({
  selector: 'app-manage-api',
  imports: [Table],
  templateUrl: './manage-api.html',
  styleUrl: './manage-api.scss',
})
export class ManageApi {
  private sanitizer = inject(DomSanitizer);
  private modal = inject(NgbModal);

  public apis: IAPI[];

  public tableConfig: ITableConfigs<IAPI> = {
    columns: [
      { title: 'API Name', field_value: 'api_name', sort: true },
      { title: 'API Key', field_value: 'api_key', sort: true },
      { title: 'Status', field_value: 'status', sort: true },
    ],
    row_action: [
      { label: 'Edit', action_to_perform: 'edit', icon: 'edit-content' },
      {
        label: 'Delete',
        action_to_perform: 'delete',
        icon: 'trash1',
        modal: true,
        model_text: 'Do you really want to delete the API Key?',
      },
    ],
    data: [] as IAPI[],
  };

  ngOnInit() {
    this.tableConfig.data = this.formatAPIDetails(APIs);
    this.apis = APIs;
  }

  handleAction(value: ITableClickedAction<IAPI>) {
    if (value.action_to_perform === 'delete' && value.data) {
      this.apis = this.apis.filter((api: IAPI) => api.id !== value.data!.id);
      this.tableConfig = {
        ...this.tableConfig,
        data: this.formatAPIDetails(this.apis),
      };
    }
  }

  private formatAPIDetails(apis: IAPI[]) {
    window.copyKey = (key: string) => {
      if (key) {
        Swal.fire({
          title: 'Copied API Key',
          icon: 'success',
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: 'top-end',
        });
        navigator.clipboard.writeText(key);
      }
    };

    return apis.map((api: IAPI) => {
      const formattedAPI = { ...api };
      formattedAPI.api_name = `<span>${api.api_name}</span>`;

      formattedAPI.api_key = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="common-f-start">
                                <span class="copied-api">${api.api_key}</span>
                                <div class="square-l-white" onclick="copyKey('${api.api_key}')"><i class="fa-solid fa-copy copy-btn"></i></div>
                              </div>`);

      formattedAPI.status = `<span class="badge badge-light-${api.status == 'Inactive' ? 'danger' : 'success'}">${api.status}</span>`;

      return formattedAPI;
    });
  }

  openModal() {
    this.modal.open(ManageApiModal, { centered: true });
  }
}
