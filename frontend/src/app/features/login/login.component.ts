import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials = { username: '', password: '', role: 'General User' };
  isLoading = false;
  errorMessage = '';
  apiDelay = 1500;

  constructor(private userService: UserService, private router: Router) {}

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService.login(this.credentials, this.apiDelay).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        this.errorMessage = err.error.message || 'Login failed';
        this.isLoading = false;
      }
    });
  }
}
