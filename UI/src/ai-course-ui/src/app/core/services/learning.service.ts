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

  // TODO: Replace with actual backend endpoints when implemented
  getSkills(userId: number): Observable<Skill[]> {
    // For now, return user skills with default requiredLevel
    return this.http.get<ApiResponse<any>>(`${this.base}/UserSkills/${userId}`).pipe(
      map(res => {
        if (!res.data || !res.data.skills) return [];
        return res.data.skills.map((s: any) => ({
          id: 0,
          name: s.skillName,
          category: 'General',
          currentLevel: s.currentLevel,
          requiredLevel: Math.min(s.currentLevel + 2, 5), // Default: 2 levels above current
        }));
      })
    );
  }

  getSkillGaps(userId: number): Observable<SkillGap[]> {
    return this.getSkills(userId).pipe(
      map(skills => {
        return skills
          .filter(s => s.currentLevel < s.requiredLevel)
          .map(s => ({
            skill: s,
            gap: s.requiredLevel - s.currentLevel,
            priority: (s.requiredLevel - s.currentLevel >= 3 ? 'high' : 
                      s.requiredLevel - s.currentLevel === 2 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
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
