import { Component, input, effect } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { socialShareOptions } from '../../../../shared/data/product';
import { IUsers } from '../../../../shared/interface/user';

@Component({
  selector: 'app-user-personal-details',
  imports: [NgbTooltipModule],
  templateUrl: './user-personal-details.html',
  styleUrl: './user-personal-details.scss',
})
export class UserPersonalDetails {
  readonly currentUser = input<IUsers | null>(null);

  public socialShareOptions = socialShareOptions;
  public user!: IUsers;

  constructor() {
    effect(() => {
      const value = this.currentUser();
      if (value) {
        this.user = { ...value };
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.user.user_profile = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfile() {
    this.user.user_profile = 'assets/images/forms/user2.png';
  }
}
