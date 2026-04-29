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
  template: `
    <!-- Skills Modal -->
    @if (showSkillsModal()) {
      <app-skills-modal 
        [isFirstTime]="isFirstTimeSkills()"
        (skillsAdded)="onSkillsAdded()"
        (modalClosed)="onModalClosed()"
      />
    }

    <div class="space-y-6">
      <!-- Welcome -->
      <div class="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 rounded-2xl p-6 text-white">
        <p class="text-white/90 text-sm">Welcome back 👋</p>
        <h1 class="text-2xl font-bold mt-1">Hello, {{ firstName() }}!</h1>
        @if (progress()) {
          <p class="text-white/90 mt-1 text-sm">
            You're on a <span class="font-bold text-white">{{ progress()!.currentStreak }}-day streak</span>. Keep it up!
          </p>
        }
        <div class="flex gap-3 mt-4">
          <a routerLink="/learning-paths"
            class="px-4 py-2 bg-white text-purple-600 text-sm font-semibold rounded-lg hover:bg-white/90 transition shadow-md">
            Continue Learning
          </a>
          <a routerLink="/skill-gap"
            class="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-lg hover:bg-white/30 transition border border-white/30">
            View Skill Gaps
          </a>
          <button
            (click)="openSkillsModal()"
            class="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-lg hover:bg-white/30 transition border border-white/30">
            Manage Skills
          </button>
        </div>
      </div>

      <!-- Stats -->
      @if (progress()) {
        @let p = progress()!;
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Courses Enrolled</p>
            <p class="text-2xl font-bold text-gray-900">{{ p.totalCoursesEnrolled }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ p.totalCoursesCompleted }} completed</p>
          </div>
          <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Hours Learned</p>
            <p class="text-2xl font-bold text-gray-900">{{ p.totalHoursLearned }}</p>
            <p class="text-xs text-gray-500 mt-1">Total learning time</p>
          </div>
          <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Day Streak</p>
            <p class="text-2xl font-bold text-gray-900">{{ p.currentStreak }}</p>
            <p class="text-xs text-gray-500 mt-1">Keep it going!</p>
          </div>
          <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Completion Rate</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ p.totalCoursesEnrolled ? ((p.totalCoursesCompleted / p.totalCoursesEnrolled) * 100 | number:'1.0-0') : 0 }}%
            </p>
            <p class="text-xs text-gray-500 mt-1">Overall progress</p>
          </div>
        </div>
      } @else if (loadingProgress()) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          @for (i of [1,2,3,4]; track i) {
            <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm animate-pulse">
              <div class="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
              <div class="h-7 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          }
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Active Learning Path -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-gray-900">Active Learning Path</h2>
            <a routerLink="/learning-paths" class="text-xs text-purple-600 hover:text-purple-700 font-medium">View all</a>
          </div>
          @if (loadingPaths()) {
            <div class="animate-pulse space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-2 bg-gray-200 rounded w-full"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          } @else if (activePath()) {
            @let path = activePath()!;
            <div>
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900 text-sm">{{ path.title }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ path.description }}</p>
                </div>
                <span class="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  {{ path.completionPercent }}%
                </span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div class="bg-gradient-to-r from-purple-600 to-purple-500 h-2 rounded-full transition-all"
                  [style.width.%]="path.completionPercent"></div>
              </div>
              <div class="space-y-2">
                @for (lpc of path.courses.slice(0, 3); track lpc.course.id) {
                  <div class="flex items-center gap-3 text-sm">
                    <div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      [class]="lpc.status === 'completed' ? 'bg-green-100' : lpc.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'">
                      @if (lpc.status === 'completed') {
                        <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      } @else if (lpc.status === 'in-progress') {
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      } @else {
                        <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                      }
                    </div>
                    <span [class]="lpc.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'">
                      {{ lpc.course.title }}
                    </span>
                  </div>
                }
              </div>
            </div>
          } @else {
            <div class="text-center py-8 text-gray-400">
              <p class="text-sm">No active learning path yet.</p>
              <a routerLink="/learning-paths" class="text-xs text-purple-600 hover:text-purple-700 font-medium mt-1 inline-block">Generate one</a>
            </div>
          }
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-gray-900">Recent Activity</h2>
            <a routerLink="/progress" class="text-xs text-purple-600 hover:text-purple-700 font-medium">View all</a>
          </div>
          @if (loadingProgress()) {
            <div class="animate-pulse space-y-4">
              @for (i of [1,2,3]; track i) {
                <div class="flex gap-3">
                  <div class="w-7 h-7 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div class="flex-1 space-y-1.5">
                    <div class="h-3 bg-gray-200 rounded w-full"></div>
                    <div class="h-2 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (progress()?.recentActivity?.length) {
            <div class="space-y-3">
              @for (item of progress()!.recentActivity; track item.date) {
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    [class]="item.type === 'completed' ? 'bg-green-100' : item.type === 'achievement' ? 'bg-yellow-100' : 'bg-purple-100'">
                    @if (item.type === 'completed') {
                      <svg class="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    } @else if (item.type === 'achievement') {
                      <svg class="w-3.5 h-3.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    } @else {
                      <svg class="w-3.5 h-3.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd"/>
                      </svg>
                    }
                  </div>
                  <div>
                    <p class="text-sm text-gray-700">{{ item.description }}</p>
                    <p class="text-xs text-gray-400 mt-0.5">{{ item.date }}</p>
                  </div>
                </div>
              }
            </div>
          } @else {
            <p class="text-sm text-gray-400 text-center py-8">No activity yet.</p>
          }
        </div>
      </div>

      <!-- Recommended Courses -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-900">Recommended for You</h2>
          <a routerLink="/courses" class="text-xs text-purple-600 hover:text-purple-700 font-medium">Browse all</a>
        </div>
        @if (loadingCourses()) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @for (i of [1,2,3]; track i) {
              <div class="border border-gray-200 rounded-xl p-4 animate-pulse">
                <div class="h-3 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            }
          </div>
        } @else if (recommendedCourses().length) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @for (course of recommendedCourses(); track course.id) {
              <div class="border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium px-2 py-0.5 rounded-full"
                    [class]="course.level === 'advanced' ? 'bg-red-50 text-red-600' : course.level === 'intermediate' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'">
                    {{ course.level }}
                  </span>
                  <span class="text-xs text-gray-400">{{ course.durationHours }}h</span>
                </div>
                <p class="text-sm font-semibold text-gray-900 mb-1">{{ course.title }}</p>
                <p class="text-xs text-gray-500 mb-3 line-clamp-2">{{ course.description }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{ course.provider }}</span>
                  <div class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-xs font-medium text-gray-700">{{ course.rating }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <p class="text-sm text-gray-400 text-center py-8">No recommendations available yet.</p>
        }
      </div>
    </div>
  `,
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
  
  // Skills modal state
  showSkillsModal = signal(false);
  hasCheckedSkills = signal(false);
  isFirstTimeSkills = signal(false);

  ngOnInit(): void {
    const userId = this.user()!.id;

    // Check user skills first
    this.checkUserSkills(userId);

    this.learningService.getProgress(userId).subscribe({
      next: p => { this.progress.set(p); this.loadingProgress.set(false); },
      error: () => this.loadingProgress.set(false),
    });

    this.learningService.getLearningPaths(userId).subscribe({
      next: paths => { this.activePath.set(paths[0] ?? null); this.loadingPaths.set(false); },
      error: () => this.loadingPaths.set(false),
    });

    this.learningService.getRecommendedCourses(userId).subscribe({
      next: courses => { this.recommendedCourses.set(courses.slice(0, 3)); this.loadingCourses.set(false); },
      error: () => this.loadingCourses.set(false),
    });
  }

  private checkUserSkills(userId: number): void {
    this.userService.getUserSkills(userId).subscribe({
      next: (userSkills) => {
        this.hasCheckedSkills.set(true);
        // If no skills exist, show the modal
        if (!userSkills.skills || userSkills.skills.length === 0) {
          this.isFirstTimeSkills.set(true);
          this.showSkillsModal.set(true);
        }
      },
      error: (error) => {
        console.error('Error checking user skills:', error);
        this.hasCheckedSkills.set(true);
        // If API call fails (e.g., 404 - no skills found), show the modal
        if (error.status === 404) {
          this.isFirstTimeSkills.set(true);
          this.showSkillsModal.set(true);
        }
      }
    });
  }

  onSkillsAdded(): void {
    this.showSkillsModal.set(false);
    // Optionally refresh data or show success message
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
