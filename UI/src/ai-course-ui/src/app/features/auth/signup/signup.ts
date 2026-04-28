import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

interface SkillInput {
  name: string;
  level: number;
}

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">LearnPath AI</h1>
          <p class="text-gray-500 mt-1">Create your learning account</p>
        </div>

        <!-- Progress Steps -->
        <div class="flex items-center justify-center mb-8">
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                [class]="step() === 1 ? 'bg-indigo-600 text-white' : 'bg-green-500 text-white'">
                @if (step() > 1) {
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                } @else {
                  1
                }
              </div>
              <span class="text-sm font-medium" [class]="step() === 1 ? 'text-gray-900' : 'text-gray-500'">Account Info</span>
            </div>
            <div class="w-12 h-0.5" [class]="step() === 2 ? 'bg-indigo-600' : 'bg-gray-300'"></div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                [class]="step() === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'">
                2
              </div>
              <span class="text-sm font-medium" [class]="step() === 2 ? 'text-gray-900' : 'text-gray-500'">Your Skills</span>
            </div>
          </div>
        </div>

        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          @if (error()) {
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {{ error() }}
            </div>
          }

          <!-- Step 1: Account Information -->
          @if (step() === 1) {
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
            <form (ngSubmit)="nextStep()" class="space-y-4">
              <!-- Full Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" [(ngModel)]="name" name="name" required
                  placeholder="John Doe"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"/>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input type="email" [(ngModel)]="email" name="email" required
                  placeholder="you@company.com"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"/>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input type="password" [(ngModel)]="password" name="password" required
                  placeholder="••••••••"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"/>
                <p class="text-xs text-gray-500 mt-1">At least 8 characters</p>
              </div>

              <!-- Role & Experience Level -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Current Role</label>
                  <input type="text" [(ngModel)]="roleName" name="roleName" required
                    placeholder="Software Engineer"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Experience Level</label>
                  <select [(ngModel)]="experienceLevel" name="experienceLevel" required
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition">
                    <option value="0">Entry Level (0-2 years)</option>
                    <option value="1">Junior (2-4 years)</option>
                    <option value="2">Mid-Level (4-7 years)</option>
                    <option value="3">Senior (7-10 years)</option>
                    <option value="4">Lead (10+ years)</option>
                  </select>
                </div>
              </div>

              <!-- Career Goal -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Career Goal</label>
                <input type="text" [(ngModel)]="careerGoal" name="careerGoal" required
                  placeholder="Engineering Manager"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"/>
                <p class="text-xs text-gray-500 mt-1">What role are you working towards?</p>
              </div>

              <button type="submit"
                class="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition shadow-md hover:shadow-lg mt-2">
                Next: Add Your Skills
              </button>
            </form>
          }

          <!-- Step 2: Skills -->
          @if (step() === 2) {
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Add Your Current Skills</h2>
            <p class="text-sm text-gray-500 mb-6">Help us understand your current skill level to provide better recommendations.</p>

            <div class="space-y-4">
              <!-- Skill Input -->
              <div class="flex gap-3">
                <div class="flex-1">
                  <input type="text" [(ngModel)]="newSkillName" placeholder="Skill name (e.g., TypeScript, Leadership)"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"/>
                </div>
                <div class="w-40">
                  <select [(ngModel)]="newSkillLevel"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition">
                    <option value="1">Beginner</option>
                    <option value="2">Elementary</option>
                    <option value="3">Intermediate</option>
                    <option value="4">Advanced</option>
                    <option value="5">Expert</option>
                  </select>
                </div>
                <button type="button" (click)="addSkill()"
                  class="px-4 py-2.5 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-200 transition">
                  Add
                </button>
              </div>

              <!-- Skills List -->
              @if (skills().length > 0) {
                <div class="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <div class="space-y-2">
                    @for (skill of skills(); track $index) {
                      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center gap-3 flex-1">
                          <span class="text-sm font-medium text-gray-800">{{ skill.name }}</span>
                          <div class="flex gap-1">
                            @for (dot of [1,2,3,4,5]; track dot) {
                              <div class="w-2 h-2 rounded-full"
                                [class]="dot <= skill.level ? 'bg-indigo-500' : 'bg-gray-300'"></div>
                            }
                          </div>
                          <span class="text-xs text-gray-500">Level {{ skill.level }}</span>
                        </div>
                        <button type="button" (click)="removeSkill($index)"
                          class="text-gray-400 hover:text-red-500 transition">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    }
                  </div>
                </div>
              } @else {
                <div class="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <svg class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <p class="text-sm text-gray-500">No skills added yet. Add your first skill above.</p>
                </div>
              }

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4">
                <button type="button" (click)="prevStep()"
                  class="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                  Back
                </button>
                <button type="button" (click)="submitSignup()" [disabled]="loading()"
                  class="flex-1 py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  @if (loading()) {
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Creating account...
                  } @else {
                    Create Account
                  }
                </button>
              </div>
              <p class="text-xs text-gray-400 text-center">You can skip this step and add skills later from your profile.</p>
            </div>
          }

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Already have an account?
              <a routerLink="/login" class="text-indigo-600 font-medium hover:underline ml-1">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Signup {
  // Step 1 fields
  name = '';
  email = '';
  password = '';
  roleName = '';
  experienceLevel = 0;
  careerGoal = '';

  // Step 2 fields
  newSkillName = '';
  newSkillLevel = 3;
  skills = signal<SkillInput[]>([]);

  // UI state
  step = signal(1);
  error = signal('');
  loading = signal(false);

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  // Expose for debugging
  get apiBase() {
    return (this.userService as any).base;
  }

  nextStep(): void {
    if (!this.name || !this.email || !this.password || !this.roleName || !this.careerGoal) {
      this.error.set('Please fill in all fields.');
      return;
    }

    if (this.password.length < 8) {
      this.error.set('Password must be at least 8 characters.');
      return;
    }

    this.error.set('');
    this.step.set(2);
  }

  prevStep(): void {
    this.step.set(1);
    this.error.set('');
  }

  addSkill(): void {
    const name = this.newSkillName.trim();
    if (!name) {
      this.error.set('Please enter a skill name.');
      return;
    }

    // Check for duplicates
    if (this.skills().some(s => s.name.toLowerCase() === name.toLowerCase())) {
      this.error.set('This skill has already been added.');
      return;
    }

    this.skills.update(current => [...current, { name, level: this.newSkillLevel }]);
    this.newSkillName = '';
    this.newSkillLevel = 3;
    this.error.set('');
  }

  removeSkill(index: number): void {
    this.skills.update(current => current.filter((_, i) => i !== index));
  }

  submitSignup(): void {
    this.error.set('');
    this.loading.set(true);

    console.log('🚀 Signup: Starting registration process');
    console.log('📝 Signup: User data:', { name: this.name, email: this.email, roleName: this.roleName, experienceLevel: this.experienceLevel });
    console.log('🎯 Signup: Skills to add:', this.skills());
    console.log('📊 Signup: Number of skills:', this.skills().length);

    // Step 1: Register user
    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      roleName: this.roleName,
      experienceLevel: this.experienceLevel,
      careerGoal: this.careerGoal,
    }).subscribe({
      next: (response: any) => {
        console.log('✅ Signup: User registered successfully');
        console.log('📦 Signup: Full registration response:', response);
        console.log('🔍 Signup: Response structure:', {
          hasData: !!response?.data,
          hasId: !!response?.data?.id,
          userId: response?.data?.id,
          dataKeys: response?.data ? Object.keys(response.data) : []
        });

        const userId = response?.data?.id;
        console.log('🆔 Signup: Extracted user ID:', userId);

        // Step 2: Add skills if any
        if (this.skills().length > 0) {
          if (userId) {
            const skillsPayload = {
              userId,
              skills: this.skills().map(s => ({ skillName: s.name, currentLevel: s.level })),
            };
            console.log('📡 Signup: Preparing to add skills');
            console.log('📤 Signup: Skills API payload:', JSON.stringify(skillsPayload, null, 2));
            console.log('🌐 Signup: API endpoint:', `${this.apiBase}/UserSkills`);
            
            this.userService.addUserSkills(skillsPayload).subscribe({
              next: (result) => {
                console.log('✅ Signup: Skills added successfully');
                console.log('📥 Signup: Skills API response:', result);
                console.log('🎉 Signup: Registration complete! Redirecting to login...');
                this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
              },
              error: (err) => {
                console.error('❌ Signup: Failed to add skills');
                console.error('📋 Signup: Error status:', err.status);
                console.error('📋 Signup: Error message:', err.message);
                console.error('📋 Signup: Error body:', err.error);
                console.error('📋 Signup: Full error object:', err);
                console.warn('⚠️ Signup: User created but skills failed - redirecting to login anyway');
                // User created but skills failed - still redirect to login
                this.router.navigate(['/login'], { queryParams: { registered: 'true', skillsError: 'true' } });
              },
            });
          } else {
            console.error('❌ Signup: Cannot add skills - User ID is missing!');
            console.error('📋 Signup: Response.data:', response?.data);
            console.error('📋 Signup: Full response:', response);
            console.warn('⚠️ Signup: This is a BACKEND ISSUE - /api/Auth/register should return user.id');
            this.router.navigate(['/login'], { queryParams: { registered: 'true', skillsError: 'true' } });
          }
        } else {
          console.log('ℹ️ Signup: No skills to add, redirecting to login');
          this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
        }
      },
      error: (err) => {
        console.error('❌ Signup: Registration failed');
        console.error('📋 Signup: Error status:', err.status);
        console.error('📋 Signup: Error message:', err.message);
        console.error('📋 Signup: Error body:', err.error);
        console.error('📋 Signup: Full error:', err);
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to create account. Please try again.');
      },
    });
  }
}
