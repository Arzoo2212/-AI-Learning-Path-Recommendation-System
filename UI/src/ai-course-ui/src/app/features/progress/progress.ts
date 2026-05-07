import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { LearningService } from '../../core/services/learning.service';
import { Progress, LearningPath } from '../../core/models/course.model';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [],
  templateUrl: './progress.html',
  styleUrl: './progress.css',
})
export class ProgressPage implements OnInit {
  private authService = inject(AuthService);
  private learningService = inject(LearningService);

  user = this.authService.currentUser;
  progress = signal<Progress | null>(null);
  paths = signal<LearningPath[]>([]);
  loading = signal(true);
  error = signal('');

  completionRate = computed(() => {
    const p = this.progress();
    if (!p || !p.totalCoursesEnrolled) return 0;
    return Math.round((p.totalCoursesCompleted / p.totalCoursesEnrolled) * 100);
  });

  maxHours = computed(() => {
    const activity = this.progress()?.weeklyActivity ?? [];
    return Math.max(...activity.map((d) => d.hours), 1);
  });

  ngOnInit(): void {
    const userId = this.user()!.id;

    this.learningService.getProgress(userId).subscribe({
      next: (p) => { this.progress.set(p); this.loading.set(false); },
      error: () => { this.error.set('Failed to load progress data.'); this.loading.set(false); },
    });

    this.learningService.getLearningPaths(userId).subscribe({
      next: (p) => this.paths.set(p),
      error: () => {},
    });
  }
}
