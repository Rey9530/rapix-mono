import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { VerificationCode } from '../verification-code/verification-code';

@Component({
  selector: 'app-email-verification',
  imports: [Card, VerificationCode],
  templateUrl: './email-verification.html',
  styleUrl: './email-verification.scss',
})
export class EmailVerification {}
