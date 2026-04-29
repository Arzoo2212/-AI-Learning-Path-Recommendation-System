import { Component, inject, signal, output, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserSkillDTO } from '../../../core/models/user.model';

@Component({
  selector: 'app-skills-modal',
  imports: [FormsModule],
  template: `
    <!-- Clean backdrop -->
    <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4" (click)="close()">
      
      <!-- Modal Container -->
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">Add Your Current Skills</h2>
          <p class="text-gray-500">Help us understand your current skill level to provide better recommendations.</p>
        </div>

        <!-- Content -->
        <div class="space-y-6">
          @if (isLoading()) {
            <div class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span class="ml-3 text-gray-600">Loading skills...</span>
            </div>
          } @else {
            
            <!-- Add Skill Form -->
            <div class="flex gap-3">
              <input
                type="text"
                [(ngModel)]="newSkillName"
                (keyup.enter)="addSkill()"
                placeholder="Skill name (e.g., TypeScript, Leadership)"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400"
              />
              
              <select
                [(ngModel)]="newSkillLevel"
                class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white min-w-[140px]"
              >
                <option value="1">Beginner</option>
                <option value="2">Basic</option>
                <option value="3">Intermediate</option>
                <option value="4">Advanced</option>
                <option value="5">Expert</option>
              </select>
            </div>

            <!-- Skills Display Area -->
            <div class="min-h-[200px] border-2 border-dashed border-gray-200 rounded-xl p-6">
              @if (skills().length === 0) {
                <div class="flex flex-col items-center justify-center h-full text-center py-8">
                  <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  <p class="text-gray-500">No skills added yet. Add your first skill above.</p>
                </div>
              } @else {
                <div class="space-y-3">
                  @for (skill of skills(); track skill.skillName) {
                    <div class="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                      <div class="flex items-center gap-3">
                        <span class="font-medium text-gray-900">{{ skill.skillName }}</span>
                        <span class="text-sm text-gray-500 bg-white px-2 py-1 rounded-full border">
                          {{ skill.currentLevel === 1 ? 'Beginner' : skill.currentLevel === 2 ? 'Basic' : skill.currentLevel === 3 ? 'Intermediate' : skill.currentLevel === 4 ? 'Advanced' : 'Expert' }}
                        </span>
                      </div>
                      <button
                        (click)="removeSkill(skill.skillName)"
                        class="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="flex gap-3 mt-8">
          <button
            (click)="close()"
            class="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Back
          </button>
          <button
            (click)="addAndSubmit()"
            [disabled]="!newSkillName.trim() || isSubmitting()"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-lg transition-all disabled:cursor-not-allowed"
          >
            @if (isSubmitting()) {
              <span class="flex items-center justify-center gap-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding...
              </span>
            } @else {
              Add
            }
          </button>
        </div>

        <!-- Skip Option -->
        @if (isFirstTime()) {
          <div class="text-center mt-4">
            <p class="text-sm text-gray-500">
              You can skip this step and add skills later from your profile.
            </p>
          </div>
        }
      </div>
    </div>
  `,
})
export class SkillsModal implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  // Inputs
  isFirstTime = input(false);

  // Outputs
  skillsAdded = output<void>();
  modalClosed = output<void>();

  // Form state
  newSkillName = '';
  newSkillLevel = 1;
  skills = signal<UserSkillDTO[]>([]);
  isSubmitting = signal(false);
  isLoading = signal(false);

  ngOnInit(): void {
    // If not first time, load existing skills
    if (!this.isFirstTime()) {
      this.loadExistingSkills();
    }
  }

  private loadExistingSkills(): void {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.isLoading.set(true);
    this.userService.getUserSkills(userId).subscribe({
      next: (userSkills) => {
        if (userSkills.skills) {
          this.skills.set([...userSkills.skills]);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading existing skills:', error);
        this.isLoading.set(false);
      }
    });
  }

  addSkill(): void {
    const skillName = this.newSkillName.trim();
    if (!skillName) return;

    // Check if skill already exists
    if (this.skills().some(s => s.skillName.toLowerCase() === skillName.toLowerCase())) {
      alert('This skill has already been added');
      return;
    }

    // Add skill to the list
    this.skills.update(skills => [...skills, {
      skillName,
      currentLevel: this.newSkillLevel
    }]);

    // Reset form
    this.newSkillName = '';
    this.newSkillLevel = 1;
  }

  removeSkill(skillName: string): void {
    this.skills.update(skills => skills.filter(s => s.skillName !== skillName));
  }

  addAndSubmit(): void {
    // First add the current skill if there's a skill name
    const skillName = this.newSkillName.trim();
    if (skillName) {
      // Check if skill already exists
      if (!this.skills().some(s => s.skillName.toLowerCase() === skillName.toLowerCase())) {
        this.skills.update(skills => [...skills, {
          skillName,
          currentLevel: this.newSkillLevel
        }]);
      }
    }

    // Then submit all skills
    if (this.skills().length === 0 || this.isSubmitting()) return;

    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.isSubmitting.set(true);

    const request = {
      userId,
      skills: this.skills()
    };

    this.userService.addUserSkills(request).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.skillsAdded.emit();
      },
      error: (error) => {
        console.error('Error adding skills:', error);
        this.isSubmitting.set(false);
        alert('Failed to save skills. Please try again.');
      }
    });
  }

  submit(): void {
    if (this.skills().length === 0 || this.isSubmitting()) return;

    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.isSubmitting.set(true);

    const request = {
      userId,
      skills: this.skills()
    };

    this.userService.addUserSkills(request).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.skillsAdded.emit();
      },
      error: (error) => {
        console.error('Error adding skills:', error);
        this.isSubmitting.set(false);
        alert('Failed to save skills. Please try again.');
      }
    });
  }

  close(): void {
    this.modalClosed.emit();
  }
}