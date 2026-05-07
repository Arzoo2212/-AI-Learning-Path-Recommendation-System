import { Component, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { LearningService } from '../../core/services/learning.service';
import { LearningPath } from '../../core/models/course.model';

@Component({
  selector: 'app-learning-paths',
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

  ngOnInit(): void {
    this.loadPaths();
  }

  loadPaths(): void {
    this.learningService.getLearningPaths(this.user()!.id).subscribe({
      next: (p) => { this.paths.set(p); this.loading.set(false); },
      error: () => { this.error.set('Failed to load learning paths.'); this.loading.set(false); },
    });
  }

  selectPath(path: LearningPath): void {
    this.selected.set(this.selected()?.id === path.id ? null : path);
  }

  generatePath(): void {
    this.generating.set(true);
    this.learningService.generateLearningPath(this.user()!.id).subscribe({
      next: (newPath) => {
        this.paths.update((p) => [...p, newPath]);
        this.generating.set(false);
      },
      error: () => {
        this.error.set('Failed to generate learning path.');
        this.generating.set(false);
      },
    });
  }
}
