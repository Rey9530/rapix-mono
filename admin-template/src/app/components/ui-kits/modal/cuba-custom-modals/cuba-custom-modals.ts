import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { BalanceModal } from '../widgets/balance-modal/balance-modal';
import { ProfileModal } from '../widgets/profile-modal/profile-modal';
import { ResultModal } from '../widgets/result-modal/result-modal';

@Component({
  selector: 'app-cuba-custom-modals',
  imports: [Card, ProfileModal, ResultModal, BalanceModal],
  templateUrl: './cuba-custom-modals.html',
  styleUrl: './cuba-custom-modals.scss',
})
export class CubaCustomModals {}
