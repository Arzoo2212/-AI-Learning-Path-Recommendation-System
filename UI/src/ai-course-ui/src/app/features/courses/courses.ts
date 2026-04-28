import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LearningService } from '../../core/services/learning.service';
import { Course } from '../../core/models/course.model';

@Component({
  selector: 'app-courses',
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Course Recommendations</h1>
        <p class="text-gray-500 mt-1 text-sm">Curated based on your skill gaps and career goals</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div class="relative flex-1 min-w-48">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onFilterChange()"
            placeholder="Search courses..."
            class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
        </div>
        <select [(ngModel)]="levelFilter" (ngModelChange)="onFilterChange()"
          class="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select [(ngModel)]="categoryFilter" (ngModelChange)="onFilterChange()"
          class="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
          <option value="">All Categories</option>
          @for (cat of categories(); track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
        <span class="text-xs text-gray-500 ml-auto">{{ courses().length }} courses</span>
      </div>

      @if (loading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div class="h-3 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div class="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          }
        </div>
      } @else if (error()) {
        <div class="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{{ error() }}</div>
      } @else if (courses().length === 0) {
        <div class="text-center py-16 text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm">No courses match your filters.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          @for (course of courses(); track course.id) {
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col">
              <div class="p-5 flex-1">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-medium px-2.5 py-1 rounded-full"
                    [class]="course.level === 'advanced' ? 'bg-red-50 text-red-600' : course.level === 'intermediate' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'">
                    {{ course.level }}
                  </span>
                  <span class="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{{ course.category }}</span>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2 leading-snug">{{ course.title }}</h3>
                <p class="text-xs text-gray-500 leading-relaxed mb-4">{{ course.description }}</p>
                <div class="flex flex-wrap gap-1.5">
                  @for (tag of course.tags; track tag) {
                    <span class="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{{ tag }}</span>
                  }
                </div>
              </div>
              <div class="px-5 pb-5 border-t border-gray-100 pt-4">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-medium text-gray-700">{{ course.provider }}</span>
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-sm font-semibold text-gray-800">{{ course.rating }}</span>
                    <span class="text-xs text-gray-400">({{ (course.enrolledCount / 1000).toFixed(1) }}k)</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{ course.durationHours }}h</span>
                  <button (click)="enroll(course.id)"
                    class="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition">
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class Courses implements OnInit {
  private authService = inject(AuthService);
  private learningService = inject(LearningService);

  user = this.authService.currentUser;
  courses = signal<Course[]>([]);
  categories = signal<string[]>([]);
  loading = signal(true);
  error = signal('');

  searchQuery = '';
  levelFilter = '';
  categoryFilter = '';

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.loading.set(true);
    const params: Record<string, string> = {};
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.levelFilter) params['level'] = this.levelFilter;
    if (this.categoryFilter) params['category'] = this.categoryFilter;

    this.learningService.getCourses(params).subscribe({
      next: c => {
        this.courses.set(c);
        if (!this.categories().length) {
          this.categories.set([...new Set(c.map(x => x.category))]);
        }
        this.loading.set(false);
      },
      error: () => { this.error.set('Failed to load courses.'); this.loading.set(false); },
    });
  }

  onFilterChange(): void {
    this.fetchCourses();
  }

  enroll(courseId: number): void {
    this.learningService.enrollCourse(this.user()!.id, courseId).subscribe();
  }
}
