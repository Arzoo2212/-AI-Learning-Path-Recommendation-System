using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.Models;
using AutoMapper;
using DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AI_Course_Recommendation_System.Controllers
{
    [Route("api/UserSkills")]
    [ApiController]
    public class UserSkillsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;
        public UserSkillsController(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserSkillResponseDTO>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserSkillResponseDTO>>>> GetAllUserSkills()
        {
            try
            {
                var users = await _db.Users
                    .Include(u => u.UserSkills)
                    .ThenInclude(us => us.Skill)
                    .ToListAsync();

                if (users == null || !users.Any())
                    return NotFound(ApiResponse<object>.NotFound("No user skills found"));

                var result = users.Select(user => new UserSkillResponseDTO
                {
                    UserName = user.Name,
                    Skills = _mapper.Map<List<SkillLevelResponseDTO>>(user.UserSkills)
                }).ToList();

                return Ok(ApiResponse<IEnumerable<UserSkillResponseDTO>>
                    .Ok(result, "All user skills retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<object>.Error(500, "Error retrieving user skills", ex.Message));
            }
        }

        [HttpGet("{userId:int}")]
        [ProducesResponseType(typeof(ApiResponse<UserSkillResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult<ApiResponse<UserSkillResponseDTO>>> GetUserSkills(int userId)
        {
            try
            {
                var user = await _db.Users
                    .Include(u => u.UserSkills)
                    .ThenInclude(us => us.Skill)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                    return NotFound("User not found");

                if (!user.UserSkills.Any())
                    return NotFound("No skills found");

                var skills = _mapper.Map<List<SkillLevelResponseDTO>>(user.UserSkills);

                var response = new UserSkillResponseDTO
                {
                    UserName = user.Name,
                    Skills = skills
                };

                return Ok(ApiResponse<UserSkillResponseDTO>.Ok(response,"User skills retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while retrieving the user.", ex.Message));
            }
        }
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<UserSkillResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<string>>> AddUserSkills(AddUserSkillDTO dto)
        {
            try
            {
                if (dto == null || dto.Skills == null || !dto.Skills.Any())
                    return BadRequest("Invalid data");

                var user = await _db.Users.FindAsync(dto.UserId);
                if (user == null)
                    return BadRequest("User not found");

                foreach (var item in dto.Skills)
                {
                    var skill = await _db.Skills
                        .FirstOrDefaultAsync(s => s.Name.ToLower() == item.SkillName.ToLower());

                    if (skill == null)
                    {
                        skill = new Skill { Name = item.SkillName.Trim() };
                        await _db.Skills.AddAsync(skill);
                        await _db.SaveChangesAsync();
                    }

                    var existing = await _db.UserSkills
                        .FirstOrDefaultAsync(us => us.UserId == user.Id && us.SkillId == skill.Id);

                    if (existing != null)
                    {
                        existing.CurrentLevel = item.CurrentLevel;
                    }
                    else
                    {
                        _db.UserSkills.Add(new UserSkill
                        {
                            UserId = user.Id,
                            SkillId = skill.Id,
                            CurrentLevel = item.CurrentLevel
                        });
                    }
                }

                await _db.SaveChangesAsync();
                return Ok(ApiResponse<string>.Ok("User skills updated successfully", "User skills updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while retrieving the user.", ex.Message));
            }
        }

    }
}
