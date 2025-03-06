import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createuser',
  imports: [ReactiveFormsModule],
  templateUrl: './createuser.component.html',
  styleUrl: './createuser.component.css',
})
export class createUserComponent {
  constructor(private authService: AuthService, private router: Router) {}
}
