using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.Models;
using AutoMapper;
using AI_Course_Recommendation_System.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AI_Course_Recommendation_System.Controllers
{
    [Route("api/Skills")]
    [ApiController]
    public class SkillController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;
        public SkillController(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<SkillDTO>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<IEnumerable<SkillDTO>>>> GetAllSkills()
        {
            try
            {
                var skills = await _db.Skills.ToListAsync();
                if (skills == null || !skills.Any())
                {
                    return NotFound(ApiResponse<object>.NotFound("No skills found."));
                }
                var skillDTOs = _mapper.Map<IEnumerable<SkillDTO>>(skills);
                return Ok(ApiResponse<IEnumerable<SkillDTO>>.Ok(skillDTOs, "Skills retrieved successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while retrieving skills.", ex.Message));
            }
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<CreateUserDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<SkillDTO>>> GetSkillById(int id)
        {
            try
            {
                var skill = await _db.Skills.FirstOrDefaultAsync(s => s.Id == id);
                if (skill == null)
                {
                    return NotFound(ApiResponse<object>.NotFound("Skill not found."));
                }
                var skillDTO = _mapper.Map<SkillDTO>(skill);
                return Ok(ApiResponse<SkillDTO>.Ok(skillDTO, "Skill retrieved successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while retrieving the skill.", ex.Message));
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<SkillDTO>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<SkillDTO>>> CreateSkill(SkillDTO skillDTO)
        {
            try
            {
                if (skillDTO == null)
                {
                    return BadRequest(ApiResponse<object>.BadRequest("Skill data is required."));
                }
                var existingSkill = await _db.Skills.FirstOrDefaultAsync(s => s.Name == skillDTO.Name);
                if (existingSkill != null)
                {
                    return BadRequest(ApiResponse<object>.BadRequest("A skill with the same name already exists."));
                }
                Skill skill = _mapper.Map<Skill>(skillDTO);
                await _db.Skills.AddRangeAsync(skill);
                await _db.SaveChangesAsync();
                var response = ApiResponse<SkillDTO>.CreatedAt(_mapper.Map<SkillDTO>(skill), "Skill created successfully.");
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while creating the skill.", ex.Message));
            }
        }
     
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<SkillDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<SkillDTO>>> UpdateSkill(int id, SkillDTO skillDTO)
        {
            try
            {
                if (skillDTO == null)
                {
                    return BadRequest(ApiResponse<object>.BadRequest("Skill data is required."));
                }
                var existingSkill = await _db.Skills.FirstOrDefaultAsync(s => s.Id == id);
                if (existingSkill == null)
                {
                    return NotFound(ApiResponse<object>.NotFound("Skill not found."));
                }
                var duplicateSkill = await _db.Skills.FirstOrDefaultAsync(s => s.Name == skillDTO.Name && s.Id != id);
                if (duplicateSkill != null)
                {
                    return BadRequest(ApiResponse<object>.BadRequest("A skill with the same name already exists."));
                }
                _mapper.Map(skillDTO, existingSkill);
                existingSkill.Id = id; // Ensure the ID remains unchanged
                await _db.SaveChangesAsync();
                var updatedSkillDTO = _mapper.Map<SkillDTO>(existingSkill);
                return Ok(ApiResponse<SkillDTO>.Ok(updatedSkillDTO, "Skill updated successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while updating the skill.", ex.Message));
            }
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<object>>> DeleteSkill(int id)
        {
            try
            {
                var existingSkill = await _db.Skills.FirstOrDefaultAsync(s => s.Id == id);
                if (existingSkill == null)
                {
                    return NotFound(ApiResponse<object>.NotFound("Skill not found."));
                }
                _db.Skills.Remove(existingSkill);
                await _db.SaveChangesAsync();
                return Ok(ApiResponse<object>.Ok(null, "Skill deleted successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while deleting the skill.", ex.Message));
            }
        }
    }
}
