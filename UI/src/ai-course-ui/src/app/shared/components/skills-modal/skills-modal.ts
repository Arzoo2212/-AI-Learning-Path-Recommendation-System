import { Component, inject, signal, output, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserSkillDTO } from '../../../core/models/user.model';

@Component({
  selector: 'app-skills-modal',
  imports: [FormsModule],
  templateUrl: './skills-modal.html',
  styleUrl: './skills-modal.css',
})
export class SkillsModal implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  isFirstTime = input(false);

  skillsAdded = output<void>();
  modalClosed = output<void>();

  newSkillName = '';
  newSkillLevel = 1;
  skills = signal<UserSkillDTO[]>([]);
  isSubmitting = signal(false);
  isLoading = signal(false);

  ngOnInit(): void {
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
      },
    });
  }

  addSkill(): void {
    const skillName = this.newSkillName.trim();
    if (!skillName) return;

    if (this.skills().some((s) => s.skillName.toLowerCase() === skillName.toLowerCase())) {
      alert('This skill has already been added');
      return;
    }

    this.skills.update((skills) => [
      ...skills,
      {
        skillName,
        currentLevel: this.newSkillLevel,
      },
    ]);

    this.newSkillName = '';
    this.newSkillLevel = 1;
  }

  removeSkill(skillName: string): void {
    this.skills.update((skills) => skills.filter((s) => s.skillName !== skillName));
  }

  addAndSubmit(): void {
    const skillName = this.newSkillName.trim();
    if (skillName) {
      if (!this.skills().some((s) => s.skillName.toLowerCase() === skillName.toLowerCase())) {
        this.skills.update((skills) => [
          ...skills,
          {
            skillName,
            currentLevel: this.newSkillLevel,
          },
        ]);
      }
    }

    if (this.skills().length === 0 || this.isSubmitting()) return;

    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.isSubmitting.set(true);

    const request = {
      userId,
      skills: this.skills(),
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
      },
    });
  }

  submit(): void {
    if (this.skills().length === 0 || this.isSubmitting()) return;

    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.isSubmitting.set(true);

    const request = {
      userId,
      skills: this.skills(),
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
      },
    });
  }

  close(): void {
    this.modalClosed.emit();
  }
}
