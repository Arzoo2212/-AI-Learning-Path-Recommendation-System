import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { LearningService } from '../../core/services/learning.service';
import { UserService } from '../../core/services/user.service';
import { LearningPath } from '../../core/models/course.model';
import { Progress } from '../../core/models/course.model';
import { Course } from '../../core/models/course.model';
import { SkillsModal } from '../../shared/components/skills-modal/skills-modal';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DecimalPipe, SkillsModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private learningService = inject(LearningService);
  private userService = inject(UserService);

  user = this.authService.currentUser;
  firstName = () => this.user()?.name?.split(' ')[0] ?? '';

  progress = signal<Progress | null>(null);
  activePath = signal<LearningPath | null>(null);
  recommendedCourses = signal<Course[]>([]);

  loadingProgress = signal(true);
  loadingPaths = signal(true);
  loadingCourses = signal(true);

  showSkillsModal = signal(false);
  hasCheckedSkills = signal(false);
  isFirstTimeSkills = signal(false);

  ngOnInit(): void {
    const userId = this.user()!.id;

    this.checkUserSkills(userId);

    this.learningService.getProgress(userId).subscribe({
      next: (p) => { this.progress.set(p); this.loadingProgress.set(false); },
      error: () => this.loadingProgress.set(false),
    });

    this.learningService.getLearningPaths(userId).subscribe({
      next: (paths) => { this.activePath.set(paths[0] ?? null); this.loadingPaths.set(false); },
      error: () => this.loadingPaths.set(false),
    });

    this.learningService.getRecommendedCourses(userId).subscribe({
      next: (courses) => { this.recommendedCourses.set(courses.slice(0, 3)); this.loadingCourses.set(false); },
      error: () => this.loadingCourses.set(false),
    });
  }

  private checkUserSkills(userId: number): void {
    this.userService.getUserSkills(userId).subscribe({
      next: (userSkills) => {
        this.hasCheckedSkills.set(true);
        if (!userSkills.skills || userSkills.skills.length === 0) {
          this.isFirstTimeSkills.set(true);
          this.showSkillsModal.set(true);
        }
      },
      error: (error) => {
        console.error('Error checking user skills:', error);
        this.hasCheckedSkills.set(true);
        if (error.status === 404) {
          this.isFirstTimeSkills.set(true);
          this.showSkillsModal.set(true);
        }
      },
    });
  }

  onSkillsAdded(): void {
    this.showSkillsModal.set(false);
    console.log('Skills added successfully!');
  }

  onModalClosed(): void {
    this.showSkillsModal.set(false);
  }

  openSkillsModal(): void {
    this.isFirstTimeSkills.set(false);
    this.showSkillsModal.set(true);
  }
}
