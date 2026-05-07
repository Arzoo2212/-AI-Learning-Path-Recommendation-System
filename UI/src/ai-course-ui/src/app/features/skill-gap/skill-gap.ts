import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { LearningService } from '../../core/services/learning.service';

import { Skill, SkillGap as SkillGapModel } from '../../core/models/user.model';

@Component({
  selector: 'app-skill-gap',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './skill-gap.html',
  styleUrl: './skill-gap.css',
})
export class SkillGap implements OnInit {

  private authService = inject(AuthService);
  private learningService = inject(LearningService);

  user = this.authService.currentUser;

  skills = signal<Skill[]>([]);
  gaps = signal<SkillGapModel[]>([]);

  loading = signal(true);
  error = signal('');

  highGaps = computed(() =>
    this.gaps().filter((g) => g.priority === 'high').length
  );

  mediumGaps = computed(() =>
    this.gaps().filter((g) => g.priority === 'medium').length
  );

  masteredSkills = computed(() =>
    this.skills().filter(
      (s) => s.requiredLevel && s.currentLevel >= s.requiredLevel
    ).length
  );

  ngOnInit(): void {

    const user = this.user();

    if (!user) return;

    const userId = user.id;

    this.learningService.getSkills(userId).subscribe({
      next: (s) => this.skills.set(s),
      error: () => {},
    });

    this.learningService.getSkillGap(userId).subscribe({
      next: (g) => {
        this.gaps.set(g);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load skill gap data.');
        this.loading.set(false);
      },
    });
  }
}