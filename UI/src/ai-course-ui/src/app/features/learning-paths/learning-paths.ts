import { Component, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { LearningService } from '../../core/services/learning.service';
import { LearningPath, LearningPathCourse } from '../../core/models/course.model';

@Component({
  selector: 'app-learning-paths',
  standalone: true,
  imports: [],
  templateUrl: './learning-paths.html',
  styleUrl: './learning-paths.css',
})
export class LearningPaths implements OnInit {
  private authService = inject(AuthService);
  private learningService = inject(LearningService);

  user = this.authService.currentUser;
  paths = signal<LearningPath[]>([]);
  selected = signal<LearningPath | null>(null);
  loading = signal(true);
  generating = signal(false);
  error = signal('');

  enrollingCourseId = signal<number | null>(null);
  updatingCourseId = signal<number | null>(null);
  actionError = signal('');

  ngOnInit(): void {
    this.loadPaths();
  }

  loadPaths(): void {
    this.loading.set(true);
    this.learningService.getLearningPaths(this.user()!.id).subscribe({
      next: (p) => { this.paths.set(p); this.loading.set(false); },
      error: () => { this.error.set('Failed to load learning paths.'); this.loading.set(false); },
    });
  }

  selectPath(path: LearningPath): void {
    this.selected.set(this.selected()?.id === path.id ? null : path);
    this.actionError.set('');
  }

  generatePath(): void {
    this.generating.set(true);
    this.error.set('');

    this.learningService.generateLearningPath(this.user()!.id).subscribe({
      next: () => {
        this.learningService.getLearningPaths(this.user()!.id).subscribe({
          next: (p) => {
            this.paths.set(p);
            if (p.length > 0) this.selected.set(p[0]);
            this.generating.set(false);
          },
          error: () => { this.generating.set(false); },
        });
      },
      error: () => {
        this.error.set('Failed to generate learning path.');
        this.generating.set(false);
      },
    });
  }

  startCourse(lpc: LearningPathCourse): void {
    const userId = this.user()!.id;
    const courseId = lpc.course.id;
    this.enrollingCourseId.set(courseId);
    this.actionError.set('');

    this.learningService.enrollCourse(userId, courseId).subscribe({
      next: () => {
        this.learningService.updateCourseStatus(userId, courseId, 'in-progress').subscribe({
          next: () => { this.enrollingCourseId.set(null); this.refreshSelected(); },
          error: () => { this.enrollingCourseId.set(null); this.refreshSelected(); },
        });
      },
      error: (err) => {
        this.enrollingCourseId.set(null);
        if (err.status === 400) {
          this.learningService.updateCourseStatus(userId, courseId, 'in-progress').subscribe({
            next: () => this.refreshSelected(),
            error: () => this.actionError.set('Failed to update course status.'),
          });
        } else {
          this.actionError.set('Failed to enroll in course.');
        }
      },
    });
  }

  completeCourse(lpc: LearningPathCourse): void {
    const userId = this.user()!.id;
    const courseId = lpc.course.id;
    this.updatingCourseId.set(courseId);
    this.actionError.set('');

    this.learningService.updateCourseStatus(userId, courseId, 'completed').subscribe({
      next: () => { this.updatingCourseId.set(null); this.refreshSelected(); },
      error: () => { this.updatingCourseId.set(null); this.actionError.set('Failed to mark course as completed.'); },
    });
  }

  private refreshSelected(): void {
    const currentId = this.selected()?.id;
    this.learningService.getLearningPaths(this.user()!.id).subscribe({
      next: (p) => {
        this.paths.set(p);
        if (currentId != null) this.selected.set(p.find(x => x.id === currentId) ?? null);
      },
    });
  }

  isBusy(courseId: number): boolean {
    return this.enrollingCourseId() === courseId || this.updatingCourseId() === courseId;
  }

  completedCount(path: LearningPath): number {
    return path.courses.filter(c => c.status === 'completed').length;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
