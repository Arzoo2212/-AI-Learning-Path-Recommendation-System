import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface FieldError {
  name: string;
  email: string;
  password: string;
  roleName: string;
  experienceLevel: string;
  careerGoal: string;
}

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-8">
      <!-- Main Container -->
      <div class="w-full max-w-6xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] overflow-hidden my-auto">
        <div class="grid lg:grid-cols-2 min-h-[500px]">
          
          <!-- Left Side - Hero Section -->
          <div class="relative bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 flex flex-col overflow-hidden">
            <!-- Decorative circles -->
            <!-- <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div class="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div> -->

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
                <h1 class="text-lg font-bold text-slate-900 mb-0.5">Create Your Account</h1>
                <p class="text-slate-500 text-[10px]">Join us and start your learning journey</p>
              </div>

              <!-- Error Messages -->
              @if (error()) {
                <div class="mb-2 p-2 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <div class="flex items-start">
                    <svg class="w-3 h-3 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div class="flex-1">
                      <p class="text-[10px] text-red-700">{{ error() }}</p>
                      @if (error().toLowerCase().includes('email') && error().toLowerCase().includes('already')) {
                        <a routerLink="/login" class="text-[10px] text-red-600 hover:text-red-800 font-semibold underline mt-1 inline-block">
                          Go to Login →
                        </a>
                      }
                    </div>
                  </div>
                </div>
              }

              <!-- Form -->
              <form (ngSubmit)="submitSignup()" class="space-y-2">
                <!-- Full Name -->
                <div class="space-y-0.5">
                  <label class="text-[10px] font-medium text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    [(ngModel)]="name" 
                    name="name" 
                    required
                    (blur)="validateName()"
                    (input)="touched.name && validateName()"
                    placeholder="Enter your full name"
                    [class.border-red-300]="touched.name && fieldErrors().name"
                    [class.bg-red-50]="touched.name && fieldErrors().name"
                    [class.border-green-300]="touched.name && !fieldErrors().name && name"
                    [class.bg-green-50]="touched.name && !fieldErrors().name && name"
                    class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 placeholder:text-[10px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  @if (touched.name && fieldErrors().name) {
                    <p class="text-[9px] text-red-600 mt-0.5 flex items-center gap-1">
                      <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      {{ fieldErrors().name }}
                    </p>
                  }
                </div>

                <!-- Email -->
                <div class="space-y-0.5">
                  <label class="text-[10px] font-medium text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    [(ngModel)]="email" 
                    name="email" 
                    required
                    (blur)="validateEmail()"
                    (input)="touched.email && validateEmail()"
                    placeholder="Enter your email"
                    [class.border-red-300]="touched.email && fieldErrors().email"
                    [class.bg-red-50]="touched.email && fieldErrors().email"
                    [class.border-green-300]="touched.email && !fieldErrors().email && email"
                    [class.bg-green-50]="touched.email && !fieldErrors().email && email"
                    class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 placeholder:text-[10px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  @if (touched.email && fieldErrors().email) {
                    <p class="text-[9px] text-red-600 mt-0.5 flex items-center gap-1">
                      <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      {{ fieldErrors().email }}
                    </p>
                  }
                </div>

                <!-- Password -->
                <div class="space-y-0.5">
                  <label class="text-[10px] font-medium text-slate-700">Password</label>
                  <input 
                    type="password" 
                    [(ngModel)]="password" 
                    name="password" 
                    required
                    (blur)="validatePassword()"
                    (input)="touched.password && validatePassword()"
                    placeholder="Create a password"
                    [class.border-red-300]="touched.password && fieldErrors().password"
                    [class.bg-red-50]="touched.password && fieldErrors().password"
                    [class.border-green-300]="touched.password && !fieldErrors().password && password"
                    [class.bg-green-50]="touched.password && !fieldErrors().password && password"
                    class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 placeholder:text-[10px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  @if (touched.password && fieldErrors().password) {
                    <p class="text-[9px] text-red-600 mt-0.5 flex items-center gap-1">
                      <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      {{ fieldErrors().password }}
                    </p>
                  }
                  @if (touched.password && !fieldErrors().password && password) {
                    <p class="text-[9px] text-green-600 mt-0.5 flex items-center gap-1">
                      <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      Strong password
                    </p>
                  }
                </div>

                <!-- Role -->
                <div class="space-y-0.5">
                  <label class="text-[10px] font-medium text-slate-700">Role</label>
                  <input 
                    type="text" 
                    [(ngModel)]="roleName" 
                    name="roleName" 
                    required
                    (blur)="validateRole()"
                    (input)="touched.roleName && validateRole()"
                    placeholder="Select your role"
                    [class.border-red-300]="touched.roleName && fieldErrors().roleName"
                    [class.bg-red-50]="touched.roleName && fieldErrors().roleName"
                    [class.border-green-300]="touched.roleName && !fieldErrors().roleName && roleName"
                    [class.bg-green-50]="touched.roleName && !fieldErrors().roleName && roleName"
                    class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 placeholder:text-[10px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  @if (touched.roleName && fieldErrors().roleName) {
                    <p class="text-[9px] text-red-600 mt-0.5 flex items-center gap-1">
                      <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      {{ fieldErrors().roleName }}
                    </p>
                  }
                </div>

                <!-- Experience Level -->
                <div class="space-y-0.5">
                  <label class="text-[10px] font-medium text-slate-700">Experience Level</label>
                  <select 
                    [(ngModel)]="experienceLevel" 
                    name="experienceLevel" 
                    required
                    (blur)="validateExperienceLevel()"
                    (change)="validateExperienceLevel()"
                    [class.border-red-300]="touched.experienceLevel && fieldErrors().experienceLevel"
                    [class.bg-red-50]="touched.experienceLevel && fieldErrors().experienceLevel"
                    [class.border-green-300]="touched.experienceLevel && !fieldErrors().experienceLevel && experienceLevel >= 0"
                    [class.bg-green-50]="touched.experienceLevel && !fieldErrors().experienceLevel && experienceLevel >= 0"
                    class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="" disabled selected>Select experience level</option>
                    <option value="0">Entry Level</option>
                    <option value="1">Junior</option>
                    <option value="2">Mid-Level</option>
                    <option value="3">Senior</option>
                    <option value="4">Lead</option>
                  </select>
                  @if (touched.experienceLevel && fieldErrors().experienceLevel) {
                    <p class="text-[9px] text-red-600 mt-0.5 flex items-center gap-1">
                      <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      {{ fieldErrors().experienceLevel }}
                    </p>
                  }
                </div>

                <!-- Career Goal -->
                <div class="space-y-0.5">
                  <label class="text-[10px] font-medium text-slate-700">Career Goal</label>
                  <input 
                    type="text" 
                    [(ngModel)]="careerGoal" 
                    name="careerGoal" 
                    required
                    (blur)="validateCareerGoal()"
                    (input)="touched.careerGoal && validateCareerGoal()"
                    placeholder="Select your career goal"
                    [class.border-red-300]="touched.careerGoal && fieldErrors().careerGoal"
                    [class.bg-red-50]="touched.careerGoal && fieldErrors().careerGoal"
                    [class.border-green-300]="touched.careerGoal && !fieldErrors().careerGoal && careerGoal"
                    [class.bg-green-50]="touched.careerGoal && !fieldErrors().careerGoal && careerGoal"
                    class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 placeholder:text-[10px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  @if (touched.careerGoal && fieldErrors().careerGoal) {
                    <p class="text-[9px] text-red-600 mt-0.5 flex items-center gap-1">
                      <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      {{ fieldErrors().careerGoal }}
                    </p>
                  }
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  [disabled]="loading()"
                  class="w-full py-1.5 px-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-xs font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-2"
                >
                  @if (loading()) {
                    <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Creating Account...
                  } @else {
                    Create Account
                  }
                </button>
              </form>

              <!-- Login Link -->
              <div class="mt-2 text-center">
                <p class="text-slate-600 text-[10px]">
                  Already have an account?
                  <a routerLink="/login" class="text-purple-600 hover:text-purple-700 font-semibold ml-1 transition-colors">Login</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Signup implements OnInit, OnDestroy {
  name = '';
  email = '';
  password = '';
  roleName = '';
  experienceLevel = 0;
  careerGoal = '';
  error = signal('');
  loading = signal(false);
  fieldErrors = signal<FieldError>({
    name: '',
    email: '',
    password: '',
    roleName: '',
    experienceLevel: '',
    careerGoal: ''
  });
  touched = {
    name: false,
    email: false,
    password: false,
    roleName: false,
    experienceLevel: false,
    careerGoal: false
  };

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    // No cleanup needed
  }

  validateName(): void {
    this.touched.name = true;
    const errors = { ...this.fieldErrors() };
    
    if (!this.name.trim()) {
      errors.name = 'Name is required';
    } else if (this.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (this.name.trim().length > 50) {
      errors.name = 'Name must not exceed 50 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(this.name)) {
      errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
    } else {
      errors.name = '';
    }
    
    this.fieldErrors.set(errors);
  }

  validateEmail(): void {
    this.touched.email = true;
    const errors = { ...this.fieldErrors() };
    
    if (!this.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.email = 'Please enter a valid email address';
    } else if (this.email.length > 100) {
      errors.email = 'Email must not exceed 100 characters';
    } else {
      errors.email = '';
    }
    
    this.fieldErrors.set(errors);
  }

  validatePassword(): void {
    this.touched.password = true;
    const errors = { ...this.fieldErrors() };
    
    if (!this.password) {
      errors.password = 'Password is required';
    } else if (this.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (this.password.length > 100) {
      errors.password = 'Password must not exceed 100 characters';
    } else if (!/(?=.*[a-z])/.test(this.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(this.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(this.password)) {
      errors.password = 'Password must contain at least one number';
    } else if (!/(?=.*[@$!%*?&#])/.test(this.password)) {
      errors.password = 'Password must contain at least one special character (@$!%*?&#)';
    } else {
      errors.password = '';
    }
    
    this.fieldErrors.set(errors);
  }

  validateRole(): void {
    this.touched.roleName = true;
    const errors = { ...this.fieldErrors() };
    
    if (!this.roleName.trim()) {
      errors.roleName = 'Role is required';
    } else if (this.roleName.trim().length < 2) {
      errors.roleName = 'Role must be at least 2 characters';
    } else if (this.roleName.trim().length > 50) {
      errors.roleName = 'Role must not exceed 50 characters';
    } else {
      errors.roleName = '';
    }
    
    this.fieldErrors.set(errors);
  }

  validateExperienceLevel(): void {
    this.touched.experienceLevel = true;
    const errors = { ...this.fieldErrors() };
    
    if (this.experienceLevel === null || this.experienceLevel === undefined || this.experienceLevel < 0) {
      errors.experienceLevel = 'Please select an experience level';
    } else {
      errors.experienceLevel = '';
    }
    
    this.fieldErrors.set(errors);
  }

  validateCareerGoal(): void {
    this.touched.careerGoal = true;
    const errors = { ...this.fieldErrors() };
    
    if (!this.careerGoal.trim()) {
      errors.careerGoal = 'Career goal is required';
    } else if (this.careerGoal.trim().length < 3) {
      errors.careerGoal = 'Career goal must be at least 3 characters';
    } else if (this.careerGoal.trim().length > 200) {
      errors.careerGoal = 'Career goal must not exceed 200 characters';
    } else {
      errors.careerGoal = '';
    }
    
    this.fieldErrors.set(errors);
  }

  validateAllFields(): boolean {
    this.validateName();
    this.validateEmail();
    this.validatePassword();
    this.validateRole();
    this.validateExperienceLevel();
    this.validateCareerGoal();

    const errors = this.fieldErrors();
    return !errors.name && !errors.email && !errors.password && 
           !errors.roleName && !errors.experienceLevel && !errors.careerGoal;
  }

  submitSignup(): void {
    if (!this.validateAllFields()) {
      this.error.set('Please fix all errors before submitting.');
      return;
    }

    this.error.set('');
    this.loading.set(true);
    this.authService.register({
      name: this.name.trim(),
      email: this.email.trim().toLowerCase(),
      password: this.password,
      roleName: this.roleName.trim(),
      experienceLevel: this.experienceLevel,
      careerGoal: this.careerGoal.trim(),
    }).subscribe({
      next: () => {
        this.router.navigate(['/login'], { 
          queryParams: { 
            registered: 'true',
            message: 'Account created successfully! Please sign in to continue.' 
          } 
        });
      },
      error: (err) => {
        this.loading.set(false);
        const errorMessage = err?.error?.message || err?.message || 'Failed to create account. Please try again.';
        
        // Check if it's an email already exists error
        if (errorMessage.toLowerCase().includes('email') && 
            (errorMessage.toLowerCase().includes('exist') || 
             errorMessage.toLowerCase().includes('already') ||
             errorMessage.toLowerCase().includes('taken') ||
             errorMessage.toLowerCase().includes('registered'))) {
          this.error.set('This email is already registered. Please use a different email or login instead.');
          const errors = { ...this.fieldErrors() };
          errors.email = 'This email is already in use';
          this.fieldErrors.set(errors);
        } else if (errorMessage.toLowerCase().includes('username') || errorMessage.toLowerCase().includes('name')) {
          this.error.set(errorMessage);
          const errors = { ...this.fieldErrors() };
          errors.name = 'Invalid username';
          this.fieldErrors.set(errors);
        } else if (errorMessage.toLowerCase().includes('password')) {
          this.error.set(errorMessage);
          const errors = { ...this.fieldErrors() };
          errors.password = 'Invalid password';
          this.fieldErrors.set(errors);
        } else {
          this.error.set(errorMessage);
        }
      },
    });
  }
}
