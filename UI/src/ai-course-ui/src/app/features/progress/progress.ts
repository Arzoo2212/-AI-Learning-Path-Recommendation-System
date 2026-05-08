import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LearningService } from '../../core/services/learning.service';
import { Progress, LearningPath } from '../../core/models/course.model';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [RouterLink],
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
    const max = Math.max(...activity.map((d) => d.hours), 1);
    return max;
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

  /** Count completed courses in a path — used in template to avoid pipe dependency */
  completedInPath(path: LearningPath): number {
    return path.courses.filter(c => c.status === 'completed').length;
  }

 
  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /** Bar height as a percentage of the max */
  barHeight(hours: number): number {
    const max = this.maxHours();
    return max > 0 ? Math.round((hours / max) * 100) : 0;
  }
}
