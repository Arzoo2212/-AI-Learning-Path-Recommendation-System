import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">LearnPath AI</h1>
          <p class="text-gray-500 mt-1">Your personalized learning journey</p>
        </div>

        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>

          @if (successMessage()) {
            <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
              {{ successMessage() }}
            </div>
          }

          @if (error()) {
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {{ error() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input type="email" [(ngModel)]="email" name="email" required
                placeholder="you@company.com"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" [(ngModel)]="password" name="password" required
                placeholder="••••••••"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"/>
            </div>
            <button type="submit" [disabled]="loading()"
              class="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition shadow-md hover:shadow-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              @if (loading()) {
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Signing in...
              } @else {
                Sign In
              }
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <a routerLink="/signup" class="text-indigo-600 font-medium hover:underline ml-1">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Login implements OnInit {
  email = '';
  password = '';
  error = signal('');
  successMessage = signal('');
  loading = signal(false);

  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        if (params['skillsError'] === 'true') {
          this.successMessage.set('Account created! Note: Skills could not be saved. You can add them from your profile after logging in.');
        } else {
          this.successMessage.set('Account created successfully! Please sign in.');
        }
      }
    });
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error.set('Please enter your email and password.');
      return;
    }
    this.error.set('');
    this.loading.set(true);

    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Invalid email or password.');
      },
    });
  }
}
