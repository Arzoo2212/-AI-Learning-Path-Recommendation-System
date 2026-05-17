import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  error = signal('');
  successMessage = signal('');
  loading = signal(false);

  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['registered'] === 'true') {
        if (params['skillsError'] === 'true') {
          this.successMessage.set(
            'Account created! Note: Skills could not be saved. You can add them from your profile after logging in.'
          );
        } else {
          this.successMessage.set('Account created successfully! Please sign in.');
        }
      }
    });

    this.loadSavedCredentials();
  }

  ngOnDestroy(): void {}

  loadSavedCredentials(): void {
    const savedEmail = localStorage.getItem('remembered_email');
    const savedPassword = localStorage.getItem('remembered_password');
    const wasRemembered = localStorage.getItem('remember_me') === 'true';

    if (wasRemembered && savedEmail && savedPassword) {
      this.email = savedEmail;
      this.password = atob(savedPassword);
      this.rememberMe = true;
    }
  }

  saveCredentials(): void {
    if (this.rememberMe) {
      localStorage.setItem('remembered_email', this.email);
      localStorage.setItem('remembered_password', btoa(this.password));
      localStorage.setItem('remember_me', 'true');
    } else {
      this.clearSavedCredentials();
    }
  }

  clearSavedCredentials(): void {
    localStorage.removeItem('remembered_email');
    localStorage.removeItem('remembered_password');
    localStorage.removeItem('remember_me');
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error.set('Please enter your email and password.');
      return;
    }
    this.error.set('');
    this.loading.set(true);

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.saveCredentials();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Invalid email or password.');
      },
    });
  }
}
