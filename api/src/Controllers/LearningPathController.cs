using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.DTO.Progress;
using AI_Course_Recommendation_System.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AI_Course_Recommendation_System.Controllers
{
    [Route("api/LearningPaths")]
    [ApiController]

    public class LearningPathsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<LearningPathsController> _logger;

        public LearningPathsController(ApplicationDbContext db, ILogger<LearningPathsController> logger)
        {
            _db = db;
            _logger = logger;
        }

        // ── GET /api/LearningPaths/{userId} ─────────────────────
        [HttpGet("{userId}")]
        public async Task<ActionResult<List<LearningPathDTO>>> GetLearningPaths(int userId)
        {
            var paths = await _db.LearningPaths
                .Include(p => p.LearningPathCourses)
                    .ThenInclude(c => c.Course)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedDate)
                .ToListAsync();

            // Fetch all enrollments for this user in one query
            var courseIds = paths
                .SelectMany(p => p.LearningPathCourses.Select(c => c.CourseId))
                .Distinct()
                .ToList();

            var enrollments = courseIds.Any()
                ? await _db.UserCourseEnrollments
                    .Where(e => e.UserId == userId && courseIds.Contains(e.CourseId))
                    .ToDictionaryAsync(e => e.CourseId)
                : new Dictionary<int, UserCourseEnrollment>();

            var result = paths.Select(path =>
            {
                var orderedCourses = path.LearningPathCourses.OrderBy(c => c.OrderIndex).ToList();
                var completedCount = orderedCourses.Count(c =>
                    enrollments.TryGetValue(c.CourseId, out var e) && e.Status == "completed");

                var completionPercent = orderedCourses.Count > 0
                    ? (int)Math.Round((double)completedCount / orderedCourses.Count * 100)
                    : 0;

                return new LearningPathDTO
                {
                    Id = path.Id,
                    Title = path.Title,
                    Description = path.Description,
                    TargetRole = path.TargetRole,
                    TotalHours = path.TotalHours,
                    CompletionPercent = completionPercent,
                    Courses = orderedCourses.Select(c =>
                    {
                        enrollments.TryGetValue(c.CourseId, out var enrollment);
                        return new LearningPathCourseDTO
                        {
                            Order = c.OrderIndex,
                            Status = enrollment?.Status ?? "not-started",
                            CompletedDate = enrollment?.CompletedDate,
                            Course = MapCourse(c.Course)
                        };
                    }).ToList()
                };
            }).ToList();

            return Ok(result);
        }

        // ── POST /api/LearningPaths/generate/{userId} ───────────
        [HttpPost("generate/{userId}")]
        public async Task<ActionResult<LearningPathDTO>> GenerateLearningPath(
            int userId,
            [FromBody] GeneratePathRequest? request)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user == null) return NotFound("User not found.");

            var targetRole = request?.TargetRole ?? user.CareerGoal ?? "Software Developer";

            
            var matchingCourses = await GetCoursesForUserAsync(userId);

            var totalHours = (int)matchingCourses.Sum(c => c.DurationHours);

            var path = new LearningPath
            {
                UserId = userId,
                Title = $"{targetRole} Learning Path",
                Description = $"A personalized path to help you become a {targetRole}, based on your current skill gaps.",
                TargetRole = targetRole,
                TotalHours = totalHours,
                CreatedDate = DateTime.UtcNow
            };

            _db.LearningPaths.Add(path);
            await _db.SaveChangesAsync();

            var pathCourses = matchingCourses.Select((course, index) => new LearningPathCourse
            {
                LearningPathId = path.Id,
                CourseId = course.Id,
                OrderIndex = index + 1
            }).ToList();

            _db.LearningPathCourses.AddRange(pathCourses);
            await _db.SaveChangesAsync();

            return Ok(new LearningPathDTO
            {
                Id = path.Id,
                Title = path.Title,
                Description = path.Description,
                TargetRole = path.TargetRole,
                TotalHours = path.TotalHours,
                CompletionPercent = 0,
                Courses = matchingCourses.Select((course, index) => new LearningPathCourseDTO
                {
                    Order = index + 1,
                    Status = "not-started",
                    CompletedDate = null,
                    Course = MapCourse(course)
                }).ToList()
            });
        }

        
        private async Task<List<Course>> GetCoursesForUserAsync(int userId)
        {
            List<string> gapSkillNames = new();

            try
            {
                var user = await _db.Users.FindAsync(userId);

                if (user != null && !string.IsNullOrEmpty(user.CareerGoal))
                {
                    // Find the role matching the user's career goal
                    var targetRole = await _db.Roles
                        .FirstOrDefaultAsync(r => r.Name.ToLower() == user.CareerGoal.ToLower());

                    if (targetRole != null)
                    {
                        // Get required skills for the target role
                        var roleSkills = await _db.RoleSkills
                            .Include(rs => rs.Skill)
                            .Where(rs => rs.RoleId == targetRole.Id)
                            .ToListAsync();

                        // Get user's current skill levels
                        var userSkills = await _db.UserSkills
                            .Where(us => us.UserId == userId)
                            .ToListAsync();

                        // Compute gaps — only include skills where user is below required level
                        gapSkillNames = roleSkills
                            .Where(rs =>
                            {
                                var userSkill = userSkills.FirstOrDefault(us => us.SkillId == rs.SkillId);
                                int currentLevel = userSkill?.CurrentLevel ?? 0;
                                return rs.RequiredLevel > currentLevel; // there is a gap
                            })
                            .OrderByDescending(rs =>
                            {
                                var userSkill = userSkills.FirstOrDefault(us => us.SkillId == rs.SkillId);
                                int currentLevel = userSkill?.CurrentLevel ?? 0;
                                return rs.RequiredLevel - currentLevel; // sort by gap size descending
                            })
                            .Select(rs => rs.Skill!.Name)
                            .ToList();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Could not compute skill gaps for path generation: {Message}", ex.Message);
            }

            List<Course> courses = new();

            if (gapSkillNames.Any())
            {
                //  courses that address the user's skill gaps
                courses = await _db.Courses
                    .Where(c => gapSkillNames.Contains(c.SkillName))
                    .OrderByDescending(c => c.Rating)
                    .Take(10)
                    .ToListAsync();
            }

            //  top-rated courses regardless of skill match
            if (!courses.Any())
            {
                courses = await _db.Courses
                    .OrderByDescending(c => c.Rating)
                    .Take(8)
                    .ToListAsync();
            }

            return courses;
        }

        private static CourseDTO MapCourse(Course c) => new()
        {
            Id = c.Id,
            Title = c.Title,
            Description = c.Description,
            ThumbnailUrl = c.ThumbnailUrl ?? string.Empty,
            Provider = c.Provider,
            Category = c.Category,
            Url = c.Url,
            SkillName = c.SkillName ?? string.Empty,
            Level = c.Level,
            DurationHours = c.DurationHours,
            Rating = c.Rating,
            EnrolledCount = c.EnrolledCount,
            Tags = c.Tags ?? string.Empty
        };
    }
}

