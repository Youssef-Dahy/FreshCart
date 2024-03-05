import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormControlOptions,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private _AuthService: AuthService, private _Router: Router) {}

  errMessage: string = '';
  isLoading: boolean = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[0-9a-zA-Z])(?=.*[a-z])(?=.*[A-Z])(?=.*[@&*]).{9,}$/
      ),
    ]),
  });

  confirmPassword(group: FormGroup): void {
    const password = group.get('password');
    const rePassword = group.get('rePassword');
    if (rePassword?.value == '') {
      rePassword?.setErrors({ required: true });
    } else if (password?.value != rePassword?.value) {
      rePassword?.setErrors({ mismatchedpasswords: true });
    }
  }
  handleForm(): void {
    const userData = this.loginForm.value;
    this.isLoading = true;

    if (this.loginForm.valid === true) {
      this._AuthService.login(userData).subscribe({
        next: (response) => {
          if (response.message == 'success') {
            localStorage.setItem('etoken', response.token);
            this._AuthService.decodeUser();

            this.isLoading = false;
            this._Router.navigate(['/home']);
          }
        },
        error: (err) => {
          this.errMessage = err.error.message;
          this.isLoading = false;
        },
      });
    }
  }
}
