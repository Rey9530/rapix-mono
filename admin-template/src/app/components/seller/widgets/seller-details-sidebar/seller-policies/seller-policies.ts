import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { sellerDetails } from '../../../../../shared/data/store';

@Component({
  selector: 'app-seller-policies',
  imports: [AngularEditorModule, FormsModule],
  templateUrl: './seller-policies.html',
  styleUrl: './seller-policies.scss',
})
export class SellerPolicies {
  public policy = sellerDetails.policies;
}
