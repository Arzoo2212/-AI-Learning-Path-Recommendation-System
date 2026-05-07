using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AI_Course_Recommendation_System.Controllers
{
    [Route("api/SkillGap")]
    [ApiController]
    public class SkillGapController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SkillGapController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<SkillGapDTO>>> GetSkillGap(
            int userId)
        {
            // Get user
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Find target role using CareerGoal
            var targetRole = await _context.Roles
                .FirstOrDefaultAsync(r =>
                    r.Name.ToLower() == user.CareerGoal.ToLower());

            if (targetRole == null)
            {
                return NotFound("Career goal role not found");
            }

            // Get required skills for target role
            var roleSkills = await _context.RoleSkills
                .Include(rs => rs.Skill)
                .Where(rs => rs.RoleId == targetRole.Id)
                .ToListAsync();

            // Get user skills
            var userSkills = await _context.UserSkills
                .Where(us => us.UserId == userId)
                .ToListAsync();

            // Calculate gaps
            var result = roleSkills.Select(rs =>
            {
                var userSkill = userSkills
                    .FirstOrDefault(us => us.SkillId == rs.SkillId);

                int currentLevel = userSkill?.CurrentLevel ?? 0;

                int gap = rs.RequiredLevel - currentLevel;

                return new SkillGapDTO
                {
                    SkillName = rs.Skill.Name,
                    CurrentLevel = currentLevel,
                    RequiredLevel = rs.RequiredLevel,
                    Gap = gap,
                    Priority = gap >= 3
                        ? "high"
                        : gap == 2
                            ? "medium"
                            : "low"
                };
            });

            return Ok(result);
        }
    }
}