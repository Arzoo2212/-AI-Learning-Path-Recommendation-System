import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course, LearningPath, Progress } from '../models/course.model';
import { Skill, SkillGap } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LearningService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getSkills(userId: number): Observable<Skill[]> {
    return this.http.get<ApiResponse<any>>(`${this.base}/UserSkills/${userId}`).pipe(
      map(res => {
        if (!res.data || !res.data.skills) return [];
        return res.data.skills.map((s: any) => ({
          id: s.id || 0,
          name: s.skillName,
          category: s.category || 'General',
          currentLevel: s.currentLevel,
          requiredLevel: s.requiredLevel || s.currentLevel, // Use backend value or default to current
        }));
      })
    );
  }

  getSkillGaps(userId: number): Observable<SkillGap[]> {
    return this.http.get<ApiResponse<any>>(`${this.base}/SkillGap/${userId}`).pipe(
      map(res => {
        if (!res.data || !res.data.gaps) return [];
        return res.data.gaps.map((g: any) => ({
          skill: {
            id: g.skillId || 0,
            name: g.skillName,
            category: g.category || 'General',
            currentLevel: g.currentLevel,
            requiredLevel: g.requiredLevel,
          },
          gap: g.gap || (g.requiredLevel - g.currentLevel),
          priority: g.priority || 'low',
        }));
      })
    );
  }

  // Placeholder methods - return empty data until backend implements these
  getCourses(params?: { search?: string; level?: string; category?: string }): Observable<Course[]> {
    // TODO: Implement when backend has course endpoints
    return of([]);
  }

  getRecommendedCourses(userId: number): Observable<Course[]> {
    // TODO: Implement when backend has recommendation endpoint
    return of([]);
  }

  getLearningPaths(userId: number): Observable<LearningPath[]> {
    // TODO: Implement when backend has learning path endpoints
    return of([]);
  }

  generateLearningPath(userId: number): Observable<LearningPath> {
    // TODO: Implement when backend has generation endpoint
    throw new Error('Learning path generation not yet implemented in backend');
  }

  getProgress(userId: number): Observable<Progress> {
    // TODO: Implement when backend has progress endpoint
    return of({
      userId,
      totalCoursesEnrolled: 0,
      totalCoursesCompleted: 0,
      totalHoursLearned: 0,
      currentStreak: 0,
      weeklyActivity: [
        { day: 'Mon', hours: 0 },
        { day: 'Tue', hours: 0 },
        { day: 'Wed', hours: 0 },
        { day: 'Thu', hours: 0 },
        { day: 'Fri', hours: 0 },
        { day: 'Sat', hours: 0 },
        { day: 'Sun', hours: 0 },
      ],
      recentActivity: [],
    });
  }

  enrollCourse(userId: number, courseId: number): Observable<void> {
    // TODO: Implement when backend has enrollment endpoint
    return of(undefined);
  }

  updateCourseStatus(userId: number, courseId: number, status: string): Observable<void> {
    // TODO: Implement when backend has status update endpoint
    return of(undefined);
  }
}
