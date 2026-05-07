import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
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

getSkillGap(userId: number): Observable<SkillGap[]> {
  return this.http.get<any>(
    `${this.base}/SkillGap/${userId}`
  ).pipe(
    map(res => {
      if (!res) return [];

      return res.map((g: any) => ({
        skill: {
          id: g.skillId || 0,
          name: g.skillName,
          category: g.category || 'General',
          currentLevel: g.currentLevel,
          requiredLevel: g.requiredLevel,
        },
        gap: g.gap,
        priority: g.priority,
      }));
    })
  );
}

  // Placeholder methods - return empty data until backend implements these
  getCourses(_params?: { search?: string; level?: string; category?: string }): Observable<Course[]> {
    // TODO: Implement when backend has course endpoints
    return EMPTY;
  }

  getRecommendedCourses(userId: number): Observable<Course[]> {
    return this.http.get<any[]>(
      `${this.base}/courses/recommended/${userId}`
    ).pipe(
      map(courses =>
        courses.map(course => ({
          id: course.Id ?? course.id,
          title: course.Title ?? course.title,
          description: course.Description ?? course.description,
          thumbnailUrl: course.ThumbnailUrl ?? course.thumbnailUrl,
          provider: course.Provider ?? course.provider,
          category: course.Category ?? course.category,
          url: course.Url ?? course.url,
          skillName: course.SkillName ?? course.skillName,
          level: course.Level ?? course.level,
          durationHours: course.DurationHours ?? course.durationHours,
          rating: course.Rating ?? course.rating,
          enrolledCount: course.EnrolledCount ?? course.enrolledCount,
          tags: (course.Tags ?? course.tags)
            ? (course.Tags ?? course.tags).split(',').map((t: string) => t.trim())
            : []
        }))
      )
    );
  }

  getLearningPaths(userId: number): Observable<LearningPath[]> {
    return this.http.get<any[]>(`${this.base}/LearningPaths/${userId}`).pipe(
      map(paths =>
        paths.map(p => ({
          id: p.Id ?? p.id,
          title: p.Title ?? p.title,
          description: p.Description ?? p.description,
          targetRole: p.TargetRole ?? p.targetRole ?? '',
          totalHours: p.TotalHours ?? p.totalHours ?? 0,
          completionPercent: p.CompletionPercent ?? p.completionPercent ?? 0,
          courses: (p.Courses ?? p.courses ?? []).map((c: any) => ({
            course: {
              id: c.Course?.Id ?? c.course?.id ?? c.CourseId ?? c.courseId ?? 0,
              title: c.Course?.Title ?? c.course?.title ?? c.Title ?? c.title ?? '',
              description: c.Course?.Description ?? c.course?.description ?? '',
              thumbnailUrl: c.Course?.ThumbnailUrl ?? c.course?.thumbnailUrl ?? '',
              provider: c.Course?.Provider ?? c.course?.provider ?? '',
              category: c.Course?.Category ?? c.course?.category ?? '',
              url: c.Course?.Url ?? c.course?.url ?? '',
              skillName: c.Course?.SkillName ?? c.course?.skillName ?? '',
              level: c.Course?.Level ?? c.course?.level ?? '',
              durationHours: c.Course?.DurationHours ?? c.course?.durationHours ?? 0,
              rating: c.Course?.Rating ?? c.course?.rating ?? 0,
              enrolledCount: c.Course?.EnrolledCount ?? c.course?.enrolledCount ?? 0,
              tags: (() => {
                const raw = c.Course?.Tags ?? c.course?.tags;
                if (!raw) return [];
                return typeof raw === 'string' ? raw.split(',').map((t: string) => t.trim()) : raw;
              })(),
            },
            order: c.Order ?? c.order ?? 0,
            status: (c.Status ?? c.status ?? 'not-started') as 'not-started' | 'in-progress' | 'completed',
            completedDate: c.CompletedDate ?? c.completedDate,
          })),
        }))
      )
    );
  }

  generateLearningPath(userId: number): Observable<LearningPath> {
    return this.http.post<any>(`${this.base}/LearningPaths/generate/${userId}`, {}).pipe(
      map(p => ({
        id: p.Id ?? p.id,
        title: p.Title ?? p.title,
        description: p.Description ?? p.description,
        targetRole: p.TargetRole ?? p.targetRole ?? '',
        totalHours: p.TotalHours ?? p.totalHours ?? 0,
        completionPercent: p.CompletionPercent ?? p.completionPercent ?? 0,
        courses: [],
      }))
    );
  }

  getProgress(userId: number): Observable<Progress> {
    return this.http.get<any>(`${this.base}/Progress/${userId}`).pipe(
      map(p => ({
        userId: p.UserId ?? p.userId ?? userId,
        totalCoursesEnrolled: p.TotalCoursesEnrolled ?? p.totalCoursesEnrolled ?? 0,
        totalCoursesCompleted: p.TotalCoursesCompleted ?? p.totalCoursesCompleted ?? 0,
        totalHoursLearned: p.TotalHoursLearned ?? p.totalHoursLearned ?? 0,
        currentStreak: p.CurrentStreak ?? p.currentStreak ?? 0,
        weeklyActivity: (p.WeeklyActivity ?? p.weeklyActivity ?? [
          { day: 'Mon', hours: 0 },
          { day: 'Tue', hours: 0 },
          { day: 'Wed', hours: 0 },
          { day: 'Thu', hours: 0 },
          { day: 'Fri', hours: 0 },
          { day: 'Sat', hours: 0 },
          { day: 'Sun', hours: 0 },
        ]).map((w: any) => ({
          day: w.Day ?? w.day,
          hours: w.Hours ?? w.hours ?? 0,
        })),
        recentActivity: (p.RecentActivity ?? p.recentActivity ?? []).map((a: any) => ({
          date: a.Date ?? a.date,
          description: a.Description ?? a.description,
          type: (a.Type ?? a.type ?? 'started') as 'completed' | 'started' | 'achievement',
        })),
      }))
    );
  }

  enrollCourse(userId: number, courseId: number): Observable<void> {
    return this.http.post<void>(`${this.base}/Progress/enroll`, { userId, courseId });
  }

  updateCourseStatus(userId: number, courseId: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.base}/Progress/course-status`, { userId, courseId, status });
  }
}
