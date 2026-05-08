using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.DTO.Progress;
using AI_Course_Recommendation_System.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AI_Course_Recommendation_System.Controllers
{
    [Route("api/progress")]
    [ApiController]
    public class ProgressController : ControllerBase
    {
         
        private readonly ApplicationDbContext _db;

        public ProgressController(ApplicationDbContext db)
        {
            _db = db;
        }

        // ── GET /api/Progress/{userId} 
        [HttpGet("{userId}")]
        public async Task<ActionResult<ProgressDTO>> GetProgress(int userId)
        {
            var enrollments = await _db.UserCourseEnrollments
                .Include(e => e.Course)
                .Where(e => e.UserId == userId)
                .ToListAsync();

            var totalEnrolled = enrollments.Count;
            var completed = enrollments.Where(e => e.Status == "completed").ToList();
            var totalCompleted = completed.Count;
            var totalHours = completed.Sum(e => e.Course.DurationHours);

            var streak = await CalculateStreakAsync(userId);
            var weeklyActivity = await GetWeeklyActivityAsync(userId);
            var recentActivity = await GetRecentActivityAsync(userId);

            return Ok(new ProgressDTO
            {
                UserId = userId,
                TotalCoursesEnrolled = totalEnrolled,
                TotalCoursesCompleted = totalCompleted,
                TotalHoursLearned = totalHours,
                CurrentStreak = streak,
                WeeklyActivity = weeklyActivity,
                RecentActivity = recentActivity
            });
        }

        // ── POST /api/Progress/enroll ───────────────────────────
        [HttpPost("enroll")]
        public async Task<ActionResult<EnrollCourseResponse>> Enroll([FromBody] EnrollCourseRequest request)
        {
            // Check for duplicate enrollment
            var existing = await _db.UserCourseEnrollments
                .FirstOrDefaultAsync(e => e.UserId == request.UserId && e.CourseId == request.CourseId);

            if (existing != null)
                return BadRequest(new EnrollCourseResponse
                {
                    Success = false,
                    Message = "Already enrolled in this course."
                });

            var course = await _db.Courses.FindAsync(request.CourseId);
            if (course == null) return NotFound("Course not found.");

            var enrollment = new UserCourseEnrollment
            {
                UserId = request.UserId,
                CourseId = request.CourseId,
                Status = "not-started",
                EnrolledDate = DateTime.UtcNow
            };

            _db.UserCourseEnrollments.Add(enrollment);

            _db.UserActivityLogs.Add(new UserActivityLog
            {
                UserId = request.UserId,
                ActivityType = "started",
                Description = $"Enrolled in '{course.Title}'",
                ActivityDate = DateTime.UtcNow,
                RelatedCourseId = request.CourseId
            });

            await _db.SaveChangesAsync();

            return Ok(new EnrollCourseResponse
            {
                Success = true,
                Message = "Successfully enrolled in course.",
                EnrollmentId = enrollment.Id
            });
        }

        // ── PUT /api/Progress/course-status ────────────────────
        [HttpPut("course-status")]
        public async Task<IActionResult> UpdateCourseStatus([FromBody] UpdateCourseStatusRequest request)
        {
            var validStatuses = new[] { "not-started", "in-progress", "completed" };
            if (!validStatuses.Contains(request.Status))
                return BadRequest("Invalid status. Must be: not-started, in-progress, or completed.");

            var enrollment = await _db.UserCourseEnrollments
                .Include(e => e.Course)
                .FirstOrDefaultAsync(e => e.UserId == request.UserId && e.CourseId == request.CourseId);

            if (enrollment == null)
                return NotFound("Enrollment not found. Enroll in the course first.");

            var previousStatus = enrollment.Status;
            enrollment.Status = request.Status;

            if (request.Status == "in-progress" && previousStatus == "not-started")
            {
                enrollment.StartedDate = DateTime.UtcNow;

                _db.UserActivityLogs.Add(new UserActivityLog
                {
                    UserId = request.UserId,
                    ActivityType = "started",
                    Description = $"Started '{enrollment.Course.Title}'",
                    ActivityDate = DateTime.UtcNow,
                    RelatedCourseId = request.CourseId
                });
            }
            else if (request.Status == "completed" && previousStatus != "completed")
            {
                enrollment.CompletedDate = DateTime.UtcNow;

                _db.UserActivityLogs.Add(new UserActivityLog
                {
                    UserId = request.UserId,
                    ActivityType = "completed",
                    Description = $"Completed '{enrollment.Course.Title}'",
                    ActivityDate = DateTime.UtcNow,
                    RelatedCourseId = request.CourseId
                });

                // Check for achievements
                await CheckAndAwardAchievementsAsync(request.UserId);
            }

            await _db.SaveChangesAsync();
            return Ok(new { Success = true, Message = "Course status updated." });
        }

    
        private async Task<int> CalculateStreakAsync(int userId)
        {
            var activityDates = await _db.UserActivityLogs
                .Where(a => a.UserId == userId)
                .Select(a => a.ActivityDate.Date)
                .Distinct()
                .OrderByDescending(d => d)
                .ToListAsync();

            if (!activityDates.Any()) return 0;

            var streak = 0;
            var today = DateTime.UtcNow.Date;
            var expected = today;

            // Allow today or yesterday as the start of an active streak
            if (activityDates[0] < today.AddDays(-1)) return 0;

            foreach (var date in activityDates)
            {
                if (date == expected || date == expected.AddDays(-1))
                {
                    streak++;
                    expected = date.AddDays(-1);
                }
                else break;
            }

            return streak;
        }

        private async Task<List<WeeklyActivityDTO>> GetWeeklyActivityAsync(int userId)
        {
            var days = new[] { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };
            var today = DateTime.UtcNow.Date;

            // Get the most recent Monday
            var dayOfWeek = (int)today.DayOfWeek;
            var monday = today.AddDays(dayOfWeek == 0 ? -6 : -(dayOfWeek - 1));

            var weekLogs = await _db.UserActivityLogs
                .Where(a => a.UserId == userId
                    && a.ActivityDate.Date >= monday
                    && a.ActivityDate.Date <= monday.AddDays(6)
                    && a.ActivityType == "completed"
                    && a.RelatedCourseId != null)
                .Include(a => a.Course)
                .ToListAsync();

            return days.Select((day, i) =>
            {
                var date = monday.AddDays(i);
                var hours = weekLogs
                    .Where(l => l.ActivityDate.Date == date)
                    .Sum(l => l.Course?.DurationHours ?? 0);

                return new WeeklyActivityDTO { Day = day, Hours = Math.Round((double)hours, 1) };
            }).ToList();
        }

        private async Task<List<ActivityItemDTO>> GetRecentActivityAsync(int userId)
        {
            return await _db.UserActivityLogs
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.ActivityDate)
                .Take(10)
                .Select(a => new ActivityItemDTO
                {
                    Date = a.ActivityDate,
                    Description = a.Description,
                    Type = a.ActivityType
                })
                .ToListAsync();
        }

        private async Task CheckAndAwardAchievementsAsync(int userId)
        {
            var completedCount = await _db.UserCourseEnrollments
                .CountAsync(e => e.UserId == userId && e.Status == "completed");

            var milestones = new Dictionary<int, string>
            {
                { 1,  "Achievement: Completed your first course!" },
                { 5,  " Achievement: Completed 5 courses!" },
                { 10, " Achievement: Completed 10 courses!" },
                { 25, " Achievement: Completed 25 courses!" }
            };

            if (milestones.TryGetValue(completedCount, out var message))
            {
                _db.UserActivityLogs.Add(new UserActivityLog
                {
                    UserId = userId,
                    ActivityType = "achievement",
                    Description = message,
                    ActivityDate = DateTime.UtcNow
                });
            }
        }
    }
}
