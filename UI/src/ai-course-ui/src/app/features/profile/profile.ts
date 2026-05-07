import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Skill } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
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
      // Refresh user data from backend to ensure roleName and other fields are current
      this.userService.getUser(userId).subscribe({
        next: (freshUser) => {
          this.authService.refreshUser(freshUser);
        },
        error: (err) => {
          console.warn('⚠️ Profile: Could not refresh user data:', err);
        },
      });

      console.log('📡 Profile: Making API call to /api/UserSkills/' + userId);
      this.userService.getUserSkills(userId).subscribe({
        next: (res) => {
          console.log('✅ Profile: Skills API response:', res);
          console.log('📊 Profile: Number of skills received:', res.skills?.length || 0);

          const skills = res.skills.map((s) => ({
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
    return (this.user()?.name ?? '')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
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
    this.userService
      .updateUser(userId, {
        name: this.editName,
        email: this.user()!.email,
        roleName: this.editRole,
        experienceLevel: this.editExpLevel,
        careerGoal: this.editGoal,
      })
      .subscribe({
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

    if (this.skills().some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
      this.skillError.set('This skill already exists');
      return;
    }

    this.addingSkill.set(true);
    this.skillError.set('');

    this.userService
      .addUserSkills({
        userId,
        skills: [{ skillName, currentLevel: this.newSkillLevel }],
      })
      .subscribe({
        next: () => {
          this.skills.update((current) => [
            ...current,
            {
              id: 0,
              name: skillName,
              currentLevel: this.newSkillLevel,
              requiredLevel: Math.min(this.newSkillLevel + 2, 5),
            },
          ]);
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
      next: (res) => {
        console.log('✅ Profile: Retry successful, skills:', res);
        const skills = res.skills.map((s) => ({
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
