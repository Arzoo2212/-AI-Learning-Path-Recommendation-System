import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Skill } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, DatePipe],
  template: `
    <div class="space-y-6 max-w-3xl">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Profile</h1>
        <p class="text-gray-500 mt-1 text-sm">Manage your information and career goals</p>
      </div>

      <!-- Profile Card -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div class="flex items-center gap-5 mb-6">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {{ initials() }}
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">{{ user()?.name }}</h2>
            <p class="text-sm text-gray-500">{{ user()?.roleName }} · Level {{ user()?.experienceLevel }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Member since {{ user()?.createdAt | date:'mediumDate' }}</p>
          </div>
        </div>

        @if (!editing()) {
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
              <p class="text-sm text-gray-800">{{ user()?.email }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Experience Level</p>
              <p class="text-sm text-gray-800">Level {{ user()?.experienceLevel }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Current Role</p>
              <p class="text-sm text-gray-800">{{ user()?.roleName }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Career Goal</p>
              <p class="text-sm text-indigo-600 font-medium">{{ user()?.careerGoal || '—' }}</p>
            </div>
          </div>
          <button (click)="startEdit()"
            class="mt-5 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition">
            Edit Profile
          </button>
        } @else {
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
              <input type="text" [(ngModel)]="editName"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Current Role</label>
              <input type="text" [(ngModel)]="editRole"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Experience Level</label>
              <select [(ngModel)]="editExpLevel"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="0">Entry Level (0-2 years)</option>
                <option value="1">Junior (2-4 years)</option>
                <option value="2">Mid-Level (4-7 years)</option>
                <option value="3">Senior (7-10 years)</option>
                <option value="4">Lead (10+ years)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Career Goal</label>
              <input type="text" [(ngModel)]="editGoal"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
            </div>
          </div>
          @if (saveError()) {
            <p class="text-xs text-red-600 mt-3">{{ saveError() }}</p>
          }
          <div class="flex gap-3 mt-5">
            <button (click)="saveProfile()" [disabled]="saving()"
              class="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-60">
              {{ saving() ? 'Saving...' : 'Save Changes' }}
            </button>
            <button (click)="editing.set(false)"
              class="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        }
      </div>

      <!-- Skills Overview -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-900">Skills Overview</h2>
          <div class="flex gap-2">
            @if (skillError() && !loadingSkills()) {
              <button (click)="retryLoadSkills()"
                class="text-sm text-gray-600 hover:text-gray-700 font-medium px-3 py-1 border border-gray-300 rounded-lg">
                🔄 Retry
              </button>
            }
            <button (click)="showAddSkills.set(!showAddSkills())"
              class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              {{ showAddSkills() ? 'Cancel' : '+ Add Skills' }}
            </button>
          </div>
        </div>

        <!-- Add Skills Form -->
        @if (showAddSkills()) {
          <div class="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div class="flex gap-3 mb-3">
              <input type="text" [(ngModel)]="newSkillName" placeholder="Skill name"
                class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
              <select [(ngModel)]="newSkillLevel"
                class="w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="1">Beginner</option>
                <option value="2">Elementary</option>
                <option value="3">Intermediate</option>
                <option value="4">Advanced</option>
                <option value="5">Expert</option>
              </select>
              <button (click)="addNewSkill()" [disabled]="addingSkill()"
                class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-60">
                {{ addingSkill() ? 'Adding...' : 'Add' }}
              </button>
            </div>
            @if (skillError()) {
              <p class="text-xs text-red-600">{{ skillError() }}</p>
            }
          </div>
        }

        <!-- Error Message -->
        @if (skillError() && !showAddSkills()) {
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-700">{{ skillError() }}</p>
          </div>
        }

        @if (loadingSkills()) {
          <div class="grid grid-cols-2 gap-3">
            @for (i of [1,2,3,4]; track i) {
              <div class="p-3 bg-gray-50 rounded-lg animate-pulse">
                <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div class="h-2 bg-gray-200 rounded w-1/3"></div>
              </div>
            }
          </div>
        } @else if (skills().length) {
          <div class="grid grid-cols-2 gap-3">
            @for (skill of skills(); track skill.id) {
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ skill.name }}</p>
                  @if (skill.category) {
                    <p class="text-xs text-gray-400">{{ skill.category }}</p>
                  }
                </div>
                <div class="flex gap-1">
                  @for (dot of [1,2,3,4,5]; track dot) {
                    <div class="w-2.5 h-2.5 rounded-full"
                      [class]="dot <= skill.currentLevel ? 'bg-indigo-500' : 'bg-gray-200'"></div>
                  }
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            @if (skillError()) {
              <!-- Error state with icon -->
              <svg class="w-12 h-12 mx-auto text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <p class="text-sm text-red-600 mb-3">{{ skillError() }}</p>
              <button (click)="showAddSkills.set(true); skillError.set('')"
                class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Try adding a skill manually
              </button>
            } @else {
              <!-- Empty state -->
              <svg class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <p class="text-sm text-gray-500 mb-2">No skills added yet</p>
              <button (click)="showAddSkills.set(true)"
                class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Add your first skill
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class Profile {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  user = this.authService.currentUser;
  skills = signal<Skill[]>([]);
  loadingSkills = signal(true);
  editing = signal(false);
  saving = signal(false);
  saveError = signal('');

  // Add skills
  showAddSkills = signal(false);
  newSkillName = '';
  newSkillLevel = 3;
  addingSkill = signal(false);
  skillError = signal('');

  editName = '';
  editRole = '';
  editExpLevel = 0;
  editGoal = '';

  constructor() {
    const userId = this.user()?.id;
    console.log('🔍 Profile: Loading skills for user ID:', userId);
    console.log('👤 Profile: Current user:', this.user());
    
    if (userId) {
      console.log('📡 Profile: Making API call to /api/UserSkills/' + userId);
      this.userService.getUserSkills(userId).subscribe({
        next: res => {
          console.log('✅ Profile: Skills API response:', res);
          console.log('📊 Profile: Number of skills received:', res.skills?.length || 0);
          
          const skills = res.skills.map(s => ({
            id: 0,
            name: s.skillName,
            currentLevel: s.currentLevel,
            requiredLevel: Math.min(s.currentLevel + 2, 5),
          }));
          console.log('🎯 Profile: Mapped skills:', skills);
          this.skills.set(skills);
          this.loadingSkills.set(false);
        },
        error: (err) => {
          console.error('❌ Profile: Error loading skills:', err);
          console.error('📋 Profile: Error status:', err.status);
          console.error('📋 Profile: Error message:', err.message);
          console.error('📋 Profile: Full error:', err);
          
          // Set error message for display
          if (err.status === 404) {
            this.skillError.set('No skills found. Add your first skill below!');
          } else if (err.status === 0) {
            this.skillError.set('Cannot connect to backend. Is the API running at https://localhost:7036?');
          } else {
            this.skillError.set(`Error loading skills: ${err.message || 'Unknown error'}`);
          }
          
          this.loadingSkills.set(false);
        },
      });
    } else {
      console.warn('⚠️ Profile: No user ID available');
      this.loadingSkills.set(false);
    }
  }

  initials(): string {
    return (this.user()?.name ?? '').split(' ').map(n => n[0]).join('').toUpperCase();
  }

  startEdit(): void {
    const u = this.user();
    this.editName = u?.name ?? '';
    this.editRole = u?.roleName ?? '';
    this.editExpLevel = u?.experienceLevel ?? 0;
    this.editGoal = u?.careerGoal ?? '';
    this.saveError.set('');
    this.editing.set(true);
  }

  saveProfile(): void {
    const userId = this.user()?.id;
    if (!userId) return;

    this.saving.set(true);
    this.userService.updateUser(userId, {
      name: this.editName,
      email: this.user()!.email,
      roleName: this.editRole,
      experienceLevel: this.editExpLevel,
      careerGoal: this.editGoal,
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
      },
      error: (err) => {
        this.saving.set(false);
        this.saveError.set(err?.error?.message ?? 'Failed to update profile.');
      },
    });
  }

  addNewSkill(): void {
    const userId = this.user()?.id;
    if (!userId) return;

    const skillName = this.newSkillName.trim();
    if (!skillName) {
      this.skillError.set('Please enter a skill name');
      return;
    }

    // Check for duplicates
    if (this.skills().some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      this.skillError.set('This skill already exists');
      return;
    }

    this.addingSkill.set(true);
    this.skillError.set('');

    this.userService.addUserSkills({
      userId,
      skills: [{ skillName, currentLevel: this.newSkillLevel }],
    }).subscribe({
      next: () => {
        // Add to local list
        this.skills.update(current => [...current, {
          id: 0,
          name: skillName,
          currentLevel: this.newSkillLevel,
          requiredLevel: Math.min(this.newSkillLevel + 2, 5),
        }]);
        this.newSkillName = '';
        this.newSkillLevel = 3;
        this.addingSkill.set(false);
        this.showAddSkills.set(false);
      },
      error: (err) => {
        this.skillError.set(err?.error?.message ?? 'Failed to add skill');
        this.addingSkill.set(false);
      },
    });
  }

  retryLoadSkills(): void {
    const userId = this.user()?.id;
    if (!userId) return;

    console.log('🔄 Profile: Retrying skills load for user ID:', userId);
    this.loadingSkills.set(true);
    this.skillError.set('');

    this.userService.getUserSkills(userId).subscribe({
      next: res => {
        console.log('✅ Profile: Retry successful, skills:', res);
        const skills = res.skills.map(s => ({
          id: 0,
          name: s.skillName,
          currentLevel: s.currentLevel,
          requiredLevel: Math.min(s.currentLevel + 2, 5),
        }));
        this.skills.set(skills);
        this.loadingSkills.set(false);
      },
      error: (err) => {
        console.error('❌ Profile: Retry failed:', err);
        if (err.status === 404) {
          this.skillError.set('No skills found. Add your first skill below!');
        } else if (err.status === 0) {
          this.skillError.set('Cannot connect to backend. Is the API running at https://localhost:7036?');
        } else {
          this.skillError.set(`Error loading skills: ${err.message || 'Unknown error'}`);
        }
        this.loadingSkills.set(false);
      },
    });
  }
}
