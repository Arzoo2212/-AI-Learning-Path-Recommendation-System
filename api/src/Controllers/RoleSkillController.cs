using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.Models;
using AutoMapper;
using AI_Course_Recommendation_System.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AI_Course_Recommendation_System.Controllers
{
    [Route("api/RoleSkills")]
    [ApiController]
    public class RoleSkillController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;

        public RoleSkillController(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<CreateRoleSkillResponseDTO>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<IEnumerable<CreateRoleSkillResponseDTO>>>> GetAllRoleSkills()
        {
            try
            {
                var roles = await _db.Roles
                    .Include(r => r.RoleSkills)
                    .ThenInclude(rs => rs.Skill)
                    .ToListAsync();

                if (roles == null || !roles.Any())
                    return NotFound(ApiResponse<object>.NotFound("No role skills found"));

                var result = roles.Select(role => new CreateRoleSkillResponseDTO
                {
                    RoleName = role.Name,
                    Skills = _mapper.Map<List<RoleSkillLevelResponseDTO>>(role.RoleSkills)
                }).ToList();

                return Ok(ApiResponse<IEnumerable<CreateRoleSkillResponseDTO>>
                    .Ok(result, "All role skills retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<object>.Error(500, "Error retrieving role skills", ex.Message));
            }
        }

        [HttpGet("{roleName}")]
        [ProducesResponseType(typeof(ApiResponse<CreateRoleSkillResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<CreateRoleSkillResponseDTO>>> GetRoleSkills(string roleName)
        {
            try
            {
                var role = await _db.Roles
                    .Include(r => r.RoleSkills)
                    .ThenInclude(rs => rs.Skill)
                    .FirstOrDefaultAsync(r => r.Name.ToLower() == roleName.ToLower());

                if (role == null)
                    return NotFound(ApiResponse<object>.NotFound("Role not found"));

                if (!role.RoleSkills.Any())
                    return NotFound(ApiResponse<object>.NotFound("No skills found for this role"));

                var skills = _mapper.Map<List<RoleSkillLevelResponseDTO>>(role.RoleSkills);

                var response = new CreateRoleSkillResponseDTO
                {
                    RoleName = role.Name,
                    Skills = skills
                };

                return Ok(ApiResponse<CreateRoleSkillResponseDTO>.Ok(response, "Role skills retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<object>.Error(500, "Error retrieving role skills", ex.Message));
            }
        }

     
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<string>>> CreateRoleSkills(CreateRoleSkillDTO dto)
        {
            try
            {
                if (dto == null || dto.Skills == null || !dto.Skills.Any())
                    return BadRequest(ApiResponse<object>.BadRequest("Invalid data"));

                var role = await _db.Roles
                    .FirstOrDefaultAsync(r => r.Name.ToLower() == dto.RoleName.ToLower());

                if (role == null)
                {
                    role = new Role { Name = dto.RoleName.Trim() };
                    await _db.Roles.AddAsync(role);
                    await _db.SaveChangesAsync();
                }

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

                    var existing = await _db.RoleSkills
                        .FirstOrDefaultAsync(rs => rs.RoleId == role.Id && rs.SkillId == skill.Id);

                    if (existing != null)
                    {
                        existing.RequiredLevel = item.RequiredLevel;
                    }
                    else
                    {
                        _db.RoleSkills.Add(new RoleSkill
                        {
                            RoleId = role.Id,
                            SkillId = skill.Id,
                            RequiredLevel = item.RequiredLevel
                        });
                    }
                }

                await _db.SaveChangesAsync();

                return Ok(ApiResponse<string>.Ok("Role skills updated successfully", "Role skills updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<object>.Error(500, "Error creating role skills", ex.Message));
            }
        }
    }
}