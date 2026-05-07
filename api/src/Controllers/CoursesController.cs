using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AI_Course_Recommendation_System.Controllers
{
    [Route("api/courses")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CoursesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("recommended/{userId}")]
        public async Task<ActionResult<IEnumerable<Course>>> GetRecommendedCourses(int userId)
        {
            // Get user
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found");

            // Find target role from CareerGoal
            var targetRole = await _context.Roles
                .FirstOrDefaultAsync(r =>
                    r.Name.Trim().ToLower() == user.CareerGoal.Trim().ToLower());

            if (targetRole == null)
                return NotFound("Career goal role not found");

            // Get required skills for target role
            var roleSkills = await _context.RoleSkills
                .Include(rs => rs.Skill)
                .Where(rs => rs.RoleId == targetRole.Id)
                .ToListAsync();

            // Get user skills
            var userSkills = await _context.UserSkills
                .Where(us => us.UserId == userId)
                .ToListAsync();

            // Find skills with a gap (current level below required)
            var highGapSkills = roleSkills
                .Where(rs =>
                {
                    var userSkill = userSkills
                        .FirstOrDefault(us => us.SkillId == rs.SkillId);

                    int currentLevel = userSkill?.CurrentLevel ?? 0;
                    return rs.RequiredLevel - currentLevel >= 1;
                })
                .Select(rs => rs.Skill.Name.Trim().ToLower())
                .ToList();

            if (!highGapSkills.Any())
                return Ok(new List<Course>());

            // Load all courses into memory, then filter by skill name matching
            var allCourses = await _context.Courses.ToListAsync();

            var recommendedCourses = allCourses
                .Where(c =>
                {
                    // Split the course's SkillName by comma into individual tags
                    var courseTags = c.SkillName
                        .ToLower()
                        .Split(',')
                        .Select(t => t.Trim())
                        .ToList();

                    // Match if any gap skill contains a course tag OR any course tag contains a gap skill
                    return highGapSkills.Any(skill =>
                        courseTags.Any(tag =>
                            tag.Contains(skill) || skill.Contains(tag)));
                })
                .ToList();

            return Ok(recommendedCourses);
        }
    }
}
