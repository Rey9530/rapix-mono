import { Component } from '@angular/core';

import { EmailVerification } from './email-verification/email-verification';
import { TwoFactorAuthentication } from './two-factor-authentication/two-factor-authentication';

@Component({
  selector: 'app-two-factor',
  imports: [TwoFactorAuthentication, EmailVerification],
  templateUrl: './two-factor.html',
  styleUrl: './two-factor.scss',
})
export class TwoFactor {}
