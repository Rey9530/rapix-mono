import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-form',
  imports: [RouterModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  readonly path = input<string>();

  public showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
