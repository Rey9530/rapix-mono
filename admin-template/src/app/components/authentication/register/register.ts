import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RegisterForm } from '../register-form/register-form';

@Component({
  selector: 'app-register',
  imports: [RouterModule, RegisterForm],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {}
