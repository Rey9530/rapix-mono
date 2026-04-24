import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RegisterForm } from '../register-form/register-form';

@Component({
  selector: 'app-register-bg-image-two',
  imports: [RouterModule, RegisterForm],
  templateUrl: './register-bg-image-two.html',
  styleUrl: './register-bg-image-two.scss',
})
export class RegisterBgImageTwo {}
