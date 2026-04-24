import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [RouterModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  readonly path = input<string>();

  public showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
