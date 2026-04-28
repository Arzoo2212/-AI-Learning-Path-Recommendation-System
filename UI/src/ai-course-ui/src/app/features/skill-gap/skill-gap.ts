import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LearningService } from '../../core/services/learning.service';
import { Skill, SkillGap as SkillGapModel } from '../../core/models/user.model';

@Component({
  selector: 'app-skill-gap',
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Skill Gap Analysis</h1>
        @if (user()?.careerGoal) {
          <p class="text-gray-500 mt-1 text-sm">
            Based on your career goal: <span class="font-medium text-indigo-600">{{ user()!.careerGoal }}</span>
          </p>
        }
      </div>

      @if (loading()) {
        <div class="grid grid-cols-3 gap-4">
          @for (i of [1,2,3]; track i) {
            <div class="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
              <div class="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          }
        </div>
      } @else if (error()) {
        <div class="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{{ error() }}</div>
      } @else {
        <!-- Summary cards -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-red-600">{{ highGaps() }}</p>
            <p class="text-sm text-red-700 mt-1">High Priority Gaps</p>
          </div>
          <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-yellow-600">{{ mediumGaps() }}</p>
            <p class="text-sm text-yellow-700 mt-1">Medium Priority</p>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-green-600">{{ masteredSkills() }}</p>
            <p class="text-sm text-green-700 mt-1">Skills Mastered</p>
          </div>
        </div>

        @if (skills().length) {
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 class="font-semibold text-gray-900 mb-5">All Skills Assessment</h2>
            <div class="space-y-5">
              @for (skill of skills(); track skill.id) {
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-gray-800">{{ skill.name }}</span>
                      <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{{ skill.category }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="text-xs text-gray-500">{{ skill.currentLevel }}/{{ skill.requiredLevel }}</span>
                      @if (skill.currentLevel >= skill.requiredLevel) {
                        <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">Mastered</span>
                      } @else if (skill.requiredLevel - skill.currentLevel >= 3) {
                        <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">High Gap</span>
                      } @else if (skill.requiredLevel - skill.currentLevel === 2) {
                        <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Medium Gap</span>
                      } @else {
                        <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Low Gap</span>
                      }
                    </div>
                  </div>
                  <div class="relative w-full bg-gray-100 rounded-full h-3">
                    <div class="absolute top-0 h-3 w-0.5 bg-gray-400 rounded-full z-10"
                      [style.left.%]="(skill.requiredLevel / 5) * 100"></div>
                    <div class="h-3 rounded-full transition-all duration-500"
                      [style.width.%]="(skill.currentLevel / 5) * 100"
                      [class]="skill.currentLevel >= skill.requiredLevel ? 'bg-green-400' : skill.requiredLevel - skill.currentLevel >= 3 ? 'bg-red-400' : skill.requiredLevel - skill.currentLevel === 2 ? 'bg-yellow-400' : 'bg-blue-400'">
                    </div>
                  </div>
                  <div class="flex justify-between mt-1">
                    <span class="text-xs text-gray-400">Current: Level {{ skill.currentLevel }}</span>
                    <span class="text-xs text-gray-400">Required: Level {{ skill.requiredLevel }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        @if (gaps().length) {
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 class="font-semibold text-gray-900 mb-4">Priority Gaps to Address</h2>
            <div class="space-y-3">
              @for (gap of gaps(); track gap.skill.id) {
                <div class="flex items-center justify-between p-4 rounded-xl border"
                  [class]="gap.priority === 'high' ? 'border-red-200 bg-red-50' : gap.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50'">
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ gap.skill.name }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">Gap of {{ gap.gap }} level{{ gap.gap > 1 ? 's' : '' }} · {{ gap.skill.category }}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-xs font-bold uppercase tracking-wide"
                      [class]="gap.priority === 'high' ? 'text-red-600' : gap.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'">
                      {{ gap.priority }}
                    </span>
                    <a routerLink="/courses"
                      class="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium">
                      Find Courses
                    </a>
                  </div>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="text-center py-12 text-gray-400">
            <p class="text-sm">No skill gaps found. Great work!</p>
          </div>
        }
      }
    </div>
  `,
})
export class SkillGap implements OnInit {
  private authService = inject(AuthService);
  private learningService = inject(LearningService);

  user = this.authService.currentUser;
  skills = signal<Skill[]>([]);
  gaps = signal<SkillGapModel[]>([]);
  loading = signal(true);
  error = signal('');

  highGaps = computed(() => this.gaps().filter(g => g.priority === 'high').length);
  mediumGaps = computed(() => this.gaps().filter(g => g.priority === 'medium').length);
  masteredSkills = computed(() => this.skills().filter(s => s.requiredLevel && s.currentLevel >= s.requiredLevel).length);

  ngOnInit(): void {
    const userId = this.user()!.id;

    this.learningService.getSkills(userId).subscribe({
      next: s => this.skills.set(s),
      error: () => {},
    });

    this.learningService.getSkillGaps(userId).subscribe({
      next: g => { this.gaps.set(g); this.loading.set(false); },
      error: () => { this.error.set('Failed to load skill gap data.'); this.loading.set(false); },
    });
  }
}
