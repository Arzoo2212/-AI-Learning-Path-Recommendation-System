import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';
import { LearningService } from '../../core/services/learning.service';

import { Course } from '../../core/models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
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

    const user = this.user();

    if (!user) return;

    this.loading.set(true);

    this.learningService
      .getRecommendedCourses(user.id)
      .subscribe({

        next: (courses) => {

          this.courses.set(courses);

          this.categories.set([
            ...new Set(courses.map(c => c.category))
          ]);

          this.loading.set(false);
        },

        error: (err) => {
          this.error.set('Failed to load recommended courses.');
          this.loading.set(false);
        }
      });
  }
}