import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-8">
      <!-- Main Container -->
      <div class="w-full max-w-6xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] overflow-hidden my-auto">
        <div class="grid lg:grid-cols-2 min-h-[500px]">
          
          <!-- Left Side - Hero Section -->
          <div class="relative bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 flex flex-col overflow-hidden">
            <!-- Decorative circles -->
            <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div class="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>

            <!-- Main Content Area -->
            <div class="flex-1 flex flex-col items-center justify-center relative px-8 lg:px-12 py-6 lg:py-8">
              <!-- Brand Name -->
              <div class="relative z-10 text-center mb-4 lg:mb-6">
                <h2 class="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
                  LearnPath AI
                </h2>
                <p class="text-white/90 text-sm lg:text-base leading-relaxed max-w-md mx-auto">
                  Start your personalized learning journey today. 
                  Our AI creates custom paths based on your goals.
                </p>
              </div>

              <!-- Feature Cards -->
              <div class="relative z-10 grid grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6 max-w-2xl">
                <!-- Smart Learning -->
                <div class="text-center">
                  <div class="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 mx-auto border border-white/30 shadow-lg">
                    <svg class="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                  </div>
                  <h3 class="font-semibold text-white text-xs">Smart Learning</h3>
                </div>

                <!-- Track Progress -->
                <div class="text-center">
                  <div class="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 mx-auto border border-white/30 shadow-lg">
                    <svg class="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <h3 class="font-semibold text-white text-xs">Track Progress</h3>
                </div>

                <!-- Custom Courses -->
                <div class="text-center">
                  <div class="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 mx-auto border border-white/30 shadow-lg">
                    <svg class="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                  <h3 class="font-semibold text-white text-xs">Custom Courses</h3>
                </div>
              </div>

              <!-- AI Learning Illustration -->
              <div class="relative z-10 w-full max-w-[280px] lg:max-w-sm">
                <img 
                  src="ai_illustraion.png" 
                  alt="AI Learning Illustration" 
                  class="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

          <!-- Right Side - Form -->
          <div class="p-4 lg:p-6 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
            <div class="w-full max-w-md">
              <!-- Header -->
              <div class="text-center mb-2">
                <h1 class="text-lg font-bold text-slate-900 mb-0.5">Welcome Back</h1>
                <p class="text-slate-500 text-[10px]">Sign in to continue your learning journey</p>
              </div>

              <!-- Error Messages -->
              @if (successMessage()) {
                <div class="mb-2 p-2 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
                  <div class="flex items-center">
                    <svg class="w-3 h-3 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <p class="text-[10px] text-emerald-700">{{ successMessage() }}</p>
                  </div>
                </div>
              }

              @if (error()) {
                <div class="mb-2 p-2 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <div class="flex items-center">
                    <svg class="w-3 h-3 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-[10px] text-red-700">{{ error() }}</p>
                  </div>
                </div>
              }

              <!-- Form -->
              <form (ngSubmit)="onSubmit()" class="space-y-2.5">
                <!-- Email -->
                <div class="space-y-0.5">
                  <label class="text-[10px] font-medium text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    [(ngModel)]="email" 
                    name="email" 
                    required
                    placeholder="Enter your email"
                    class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 placeholder:text-[10px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <!-- Password -->
                <div class="space-y-0.5">
                  <label class="text-[10px] font-medium text-slate-700">Password</label>
                  <input 
                    type="password" 
                    [(ngModel)]="password" 
                    name="password" 
                    required
                    placeholder="Enter your password"
                    class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 placeholder:text-[10px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="flex items-center justify-between text-[10px]">
                  <label class="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="rememberMe"
                      name="rememberMe"
                      class="w-3 h-3 text-purple-600 bg-white border-slate-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                    >
                    <span class="ml-1.5 text-slate-600">Remember me</span>
                  </label>
                  <a href="#" class="text-purple-600 hover:text-purple-700 font-medium transition-colors">Forgot password?</a>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  [disabled]="loading()"
                  class="w-full py-1.5 px-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-xs font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  @if (loading()) {
                    <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing In...
                  } @else {
                    Sign In
                  }
                </button>
              </form>

              <!-- Signup Link -->
              <div class="mt-2 text-center">
                <p class="text-slate-600 text-[10px]">
                  Don't have an account?
                  <a routerLink="/signup" class="text-purple-600 hover:text-purple-700 font-semibold ml-1 transition-colors">Sign up</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Login implements OnInit, OnDestroy {
  email = '';
  password = '';
  rememberMe = false;
  error = signal('');
  successMessage = signal('');
  loading = signal(false);

  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Check for registration success message
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        if (params['skillsError'] === 'true') {
          this.successMessage.set('Account created! Note: Skills could not be saved. You can add them from your profile after logging in.');
        } else {
          this.successMessage.set('Account created successfully! Please sign in.');
        }
      }
    });

    // Load saved credentials if "Remember Me" was checked
    this.loadSavedCredentials();
  }

  ngOnDestroy(): void {
    // No cleanup needed
  }

  loadSavedCredentials(): void {
    const savedEmail = localStorage.getItem('remembered_email');
    const savedPassword = localStorage.getItem('remembered_password');
    const wasRemembered = localStorage.getItem('remember_me') === 'true';

    if (wasRemembered && savedEmail && savedPassword) {
      this.email = savedEmail;
      this.password = atob(savedPassword); // Decode from base64
      this.rememberMe = true;
    }
  }

  saveCredentials(): void {
    if (this.rememberMe) {
      localStorage.setItem('remembered_email', this.email);
      localStorage.setItem('remembered_password', btoa(this.password)); // Encode to base64
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
        // Save or clear credentials based on "Remember Me" checkbox
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
