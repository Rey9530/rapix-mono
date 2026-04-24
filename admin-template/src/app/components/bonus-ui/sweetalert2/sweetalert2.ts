import { Component } from '@angular/core';

import { AjaxRequestSweetalert } from './widgets/ajax-request-sweetalert/ajax-request-sweetalert';
import { AnimatedSweetalert } from './widgets/animated-sweetalert/animated-sweetalert';
import { BasicSweetalert } from './widgets/basic-sweetalert/basic-sweetalert';
import { ConfirmationApprovalSweetalert } from './widgets/confirmation-approval-sweetalert/confirmation-approval-sweetalert';
import { ConfirmationSweetalert } from './widgets/confirmation-sweetalert/confirmation-sweetalert';
import { ConfirmationTriggerSweetalert } from './widgets/confirmation-trigger-sweetalert/confirmation-trigger-sweetalert';
import { CustomPositionedSweetalert } from './widgets/custom-positioned-sweetalert/custom-positioned-sweetalert';
import { DateSweetalert } from './widgets/date-sweetalert/date-sweetalert';
import { DismissSweetalert } from './widgets/dismiss-sweetalert/dismiss-sweetalert';
import { FormSweetalert } from './widgets/form-sweetalert/form-sweetalert';
import { ImageMessageSweetalert } from './widgets/image-message-sweetalert/image-message-sweetalert';
import { PasswordGeneratorSweetalert } from './widgets/password-generator-sweetalert/password-generator-sweetalert';
import { PositionSweetAlert } from './widgets/position-sweet-alert/position-sweet-alert';
import { RichHtmlSweetalert } from './widgets/rich-html-sweetalert/rich-html-sweetalert';
import { RtlSupportSweetalert } from './widgets/rtl-support-sweetalert/rtl-support-sweetalert';
import { TimerSweetalert } from './widgets/timer-sweetalert/timer-sweetalert';
import { TitleTextSweetalert } from './widgets/title-text-sweetalert/title-text-sweetalert';

@Component({
  selector: 'app-sweetalert2',
  imports: [
    PositionSweetAlert,
    BasicSweetalert,
    TitleTextSweetalert,
    DismissSweetalert,
    RichHtmlSweetalert,
    ConfirmationSweetalert,
    AnimatedSweetalert,
    ConfirmationTriggerSweetalert,
    ImageMessageSweetalert,
    TimerSweetalert,
    AjaxRequestSweetalert,
    ConfirmationApprovalSweetalert,
    RtlSupportSweetalert,
    PasswordGeneratorSweetalert,
    DateSweetalert,
    FormSweetalert,
    CustomPositionedSweetalert,
  ],
  templateUrl: './sweetalert2.html',
  styleUrl: './sweetalert2.scss',
})
export class Sweetalert2 {}
