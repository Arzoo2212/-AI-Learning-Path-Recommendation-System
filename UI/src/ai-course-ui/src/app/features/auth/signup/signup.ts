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
  templateUrl: './signup.html',
  styleUrl: './signup.css',
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
    careerGoal: '',
  });
  touched = {
    name: false,
    email: false,
    password: false,
    roleName: false,
    experienceLevel: false,
    careerGoal: false,
  };

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {}

  ngOnDestroy(): void {}

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
    return (
      !errors.name &&
      !errors.email &&
      !errors.password &&
      !errors.roleName &&
      !errors.experienceLevel &&
      !errors.careerGoal
    );
  }

  submitSignup(): void {
    if (!this.validateAllFields()) {
      this.error.set('Please fix all errors before submitting.');
      return;
    }

    this.error.set('');
    this.loading.set(true);
    this.authService
      .register({
        name: this.name.trim(),
        email: this.email.trim().toLowerCase(),
        password: this.password,
        roleName: this.roleName.trim(),
        experienceLevel: this.experienceLevel,
        careerGoal: this.careerGoal.trim(),
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/login'], {
            queryParams: {
              registered: 'true',
              message: 'Account created successfully! Please sign in to continue.',
            },
          });
        },
        error: (err) => {
          this.loading.set(false);
          const errorMessage =
            err?.error?.message || err?.message || 'Failed to create account. Please try again.';

          if (
            errorMessage.toLowerCase().includes('email') &&
            (errorMessage.toLowerCase().includes('exist') ||
              errorMessage.toLowerCase().includes('already') ||
              errorMessage.toLowerCase().includes('taken') ||
              errorMessage.toLowerCase().includes('registered'))
          ) {
            this.error.set(
              'This email is already registered. Please use a different email or login instead.'
            );
            const errors = { ...this.fieldErrors() };
            errors.email = 'This email is already in use';
            this.fieldErrors.set(errors);
          } else if (
            errorMessage.toLowerCase().includes('username') ||
            errorMessage.toLowerCase().includes('name')
          ) {
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
