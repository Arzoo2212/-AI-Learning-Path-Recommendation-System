import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { LearningService } from '../../core/services/learning.service';
import { Progress } from '../../core/models/course.model';
import { LearningPath } from '../../core/models/course.model';

@Component({
  selector: 'app-progress',
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Progress Tracking</h1>
        <p class="text-gray-500 mt-1 text-sm">Your learning journey at a glance</p>
      </div>

      @if (loading()) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          @for (i of [1,2,3,4]; track i) {
            <div class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse text-center">
              <div class="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          }
        </div>
      } @else if (error()) {
        <div class="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{{ error() }}</div>
      } @else if (progress()) {
        @let p = progress()!;

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
            <p class="text-3xl font-bold text-indigo-600">{{ p.totalCoursesCompleted }}</p>
            <p class="text-sm text-gray-500 mt-1">Courses Completed</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
            <p class="text-3xl font-bold text-purple-600">{{ p.totalHoursLearned }}</p>
            <p class="text-sm text-gray-500 mt-1">Hours Learned</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
            <p class="text-3xl font-bold text-orange-500">{{ p.currentStreak }}</p>
            <p class="text-sm text-gray-500 mt-1">Day Streak 🔥</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
            <p class="text-3xl font-bold text-green-600">{{ completionRate() }}%</p>
            <p class="text-sm text-gray-500 mt-1">Completion Rate</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Weekly Activity -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 class="font-semibold text-gray-900 mb-5">Weekly Activity</h2>
            @if (p.weeklyActivity?.length) {              <div class="flex items-end gap-3 h-32">
                @for (day of p.weeklyActivity; track day.day) {
                  <div class="flex-1 flex flex-col items-center gap-2">
                    <span class="text-xs text-gray-500">{{ day.hours }}h</span>
                    <div class="w-full rounded-t-lg transition-all"
                      [style.height.%]="maxHours() > 0 ? (day.hours / maxHours()) * 100 : 0"
                      [class]="day.hours === 0 ? 'bg-gray-100' : 'bg-gradient-to-t from-indigo-500 to-purple-400'"
                      style="min-height: 4px; max-height: 100%">
                    </div>
                    <span class="text-xs font-medium text-gray-500">{{ day.day }}</span>
                  </div>
                }
              </div>
            } @else {
              <p class="text-sm text-gray-400 text-center py-8">No activity data yet.</p>
            }
          </div>

          <!-- Learning Path Progress -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 class="font-semibold text-gray-900 mb-5">Learning Path Progress</h2>
            @if (paths().length) {
              <div class="space-y-4">
                @for (path of paths(); track path.id) {
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <p class="text-sm font-medium text-gray-800">{{ path.title }}</p>
                      <span class="text-sm font-semibold text-indigo-600">{{ path.completionPercent }}%</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2.5">
                      <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all"
                        [style.width.%]="path.completionPercent"></div>
                    </div>
                    <p class="text-xs text-gray-400 mt-1">
                      {{ path.courses.filter(c => c.status === 'completed').length }}/{{ path.courses.length }} courses · {{ path.totalHours }}h total
                    </p>
                  </div>
                }
              </div>
            } @else {
              <p class="text-sm text-gray-400 text-center py-8">No learning paths yet.</p>
            }
          </div>
        </div>

        <!-- Activity Timeline -->
        @if (p.recentActivity?.length) {          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 class="font-semibold text-gray-900 mb-5">Activity Timeline</h2>
            <div class="relative">
              <div class="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div class="space-y-5">
                @for (item of p.recentActivity; track item.date) {
                  <div class="flex items-start gap-4 relative">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 border-white"
                      [class]="item.type === 'completed' ? 'bg-green-500' : item.type === 'achievement' ? 'bg-yellow-400' : 'bg-blue-500'">
                      @if (item.type === 'completed') {
                        <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      } @else if (item.type === 'achievement') {
                        <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      } @else {
                        <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd"/>
                        </svg>
                      }
                    </div>
                    <div class="flex-1 pb-1">
                      <p class="text-sm text-gray-800">{{ item.description }}</p>
                      <p class="text-xs text-gray-400 mt-0.5">{{ item.date }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
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
    return Math.max(...activity.map(d => d.hours), 1);
  });

  ngOnInit(): void {
    const userId = this.user()!.id;

    this.learningService.getProgress(userId).subscribe({
      next: p => { this.progress.set(p); this.loading.set(false); },
      error: () => { this.error.set('Failed to load progress data.'); this.loading.set(false); },
    });

    this.learningService.getLearningPaths(userId).subscribe({
      next: p => this.paths.set(p),
      error: () => {},
    });
  }
}
