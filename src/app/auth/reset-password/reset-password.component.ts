import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  successMessage: string = '';
  currentUser: string = '';
  // token property to get token from url to send with request.
  token: string = '';

  constructor() {}

  resetPasswordForm = this.formBuilder.group({
    newPassword: ['', [Validators.required, Validators.minLength(5)]],
  });

  onSubmit() {
    this.authService
      .resetPassword(this.resetPasswordForm.value, this.token)
      .subscribe({
        next: (response) => {
          console.log(response, 'data sent from reset password');
          this.successMessage = response.message;
          this.currentUser = response.username;
        },
        error: (error) => {
          console.log(error, 'error from reset password');
        },
        complete: () => {
          console.log('complete');
          this.resetPasswordForm.reset();
        },
      });
  }

  ngOnInit(): void {
    // get token from url
    this.token = this.route.snapshot.queryParams['token'];
    console.log(this.token, 'token in url');
  }
}
