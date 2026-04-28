import { Component, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { LearningService } from '../../core/services/learning.service';
import { LearningPath } from '../../core/models/course.model';

@Component({
  selector: 'app-learning-paths',
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Learning Paths</h1>
          <p class="text-gray-500 mt-1 text-sm">AI-generated paths tailored to your career goals</p>
        </div>
        <button (click)="generatePath()" [disabled]="generating()"
          class="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
          @if (generating()) {
            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Generating...
          } @else {
            + Generate New Path
          }
        </button>
      </div>

      @if (loading()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          @for (i of [1,2]; track i) {
            <div class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
              <div class="h-2 bg-gray-200 rounded w-full mb-4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          }
        </div>
      } @else if (error()) {
        <div class="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{{ error() }}</div>
      } @else if (paths().length === 0) {
        <div class="text-center py-16 bg-white rounded-xl border border-gray-200">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
          </svg>
          <p class="text-sm text-gray-500">No learning paths yet.</p>
          <p class="text-xs text-gray-400 mt-1">Click "Generate New Path" to get started.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          @for (path of paths(); track path.id) {
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              (click)="selectPath(path)">
              <div class="p-5">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ path.title }}</h3>
                    <p class="text-xs text-gray-500 mt-1">{{ path.description }}</p>
                  </div>
                  <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full whitespace-nowrap ml-3">
                    {{ path.completionPercent }}% done
                  </span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2 mb-4">
                  <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                    [style.width.%]="path.completionPercent"></div>
                </div>
                <div class="flex items-center gap-4 text-xs text-gray-500">
                  <span>{{ path.totalHours }}h total</span>
                  <span>{{ path.courses.length }} courses</span>
                  <span>Target: {{ path.targetRole }}</span>
                </div>
              </div>
            </div>
          }
        </div>

        @if (selected()) {
          @let path = selected()!;
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div class="flex items-center justify-between mb-5">
              <h2 class="font-semibold text-gray-900 text-lg">{{ path.title }} — Course Breakdown</h2>
              <button (click)="selected.set(null)" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="space-y-3">
              @for (lpc of path.courses; track lpc.course.id) {
                <div class="flex items-center gap-4 p-4 rounded-xl border"
                  [class]="lpc.status === 'completed' ? 'border-green-200 bg-green-50' : lpc.status === 'in-progress' ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-gray-50'">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    [class]="lpc.status === 'completed' ? 'bg-green-200 text-green-700' : lpc.status === 'in-progress' ? 'bg-indigo-200 text-indigo-700' : 'bg-gray-200 text-gray-500'">
                    {{ lpc.order }}
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-900">{{ lpc.course.title }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ lpc.course.provider }} · {{ lpc.course.durationHours }}h · {{ lpc.course.level }}</p>
                  </div>
                  @if (lpc.status === 'completed') {
                    <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">Completed</span>
                  } @else if (lpc.status === 'in-progress') {
                    <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">In Progress</span>
                  } @else {
                    <button class="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                      Start
                    </button>
                  }
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
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
      next: p => { this.paths.set(p); this.loading.set(false); },
      error: () => { this.error.set('Failed to load learning paths.'); this.loading.set(false); },
    });
  }

  selectPath(path: LearningPath): void {
    this.selected.set(this.selected()?.id === path.id ? null : path);
  }

  generatePath(): void {
    this.generating.set(true);
    this.learningService.generateLearningPath(this.user()!.id).subscribe({
      next: newPath => {
        this.paths.update(p => [...p, newPath]);
        this.generating.set(false);
      },
      error: () => {
        this.error.set('Failed to generate learning path.');
        this.generating.set(false);
      },
    });
  }
}
