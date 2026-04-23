using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.Models;
using AutoMapper;
using DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AI_Course_Recommendation_System.Controllers
{
    [Route("api/Roles")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;
        public RoleController(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }


        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<RoleDTO>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<IEnumerable<RoleDTO>>>> GetAllRoles()
        {
            try
            {
                var roles = await _db.Roles.ToListAsync();
                if (roles == null || !roles.Any())
                {
                    return NotFound(ApiResponse<object>.NotFound("No roles found."));
                }
                var roleDTOs = _mapper.Map<IEnumerable<RoleDTO>>(roles);
                return Ok(ApiResponse<IEnumerable<RoleDTO>>.Ok(roleDTOs, "Roles retrieved successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while retrieving roles.", ex.Message));
            }
        }


        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<RoleDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<RoleDTO>>> GetRoleById(int id)
        {
            try
            {
                var role = await _db.Roles.FirstOrDefaultAsync(r => r.Id == id);
                if (role == null)
                {
                    return NotFound(ApiResponse<object>.NotFound("Role not found."));
                }
                var roleDTO = _mapper.Map<RoleDTO>(role);
                return Ok(ApiResponse<RoleDTO>.Ok(roleDTO, "Role retrieved successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while retrieving the role.", ex.Message));
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<RoleDTO>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<RoleDTO>>> CreateRole(RoleDTO roleDTO)
        {
            try
            {
                if (roleDTO == null)
                {
                    return BadRequest(ApiResponse<object>.BadRequest("Role data is required."));
                }
                var existingRole = await _db.Roles.FirstOrDefaultAsync(r => r.Name == roleDTO.Name);
                if (existingRole != null)
                {
                    return BadRequest(ApiResponse<object>.BadRequest("A role with the same name already exists."));
                }
                Role role = _mapper.Map<Role>(roleDTO);
                await _db.Roles.AddAsync(role);
                await _db.SaveChangesAsync();
                var response = ApiResponse<RoleDTO>.CreatedAt(_mapper.Map<RoleDTO>(role), "Role created successfully.");
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while creating the role.", ex.Message));
            }
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<RoleDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<RoleDTO>>> UpdateRole(int id, RoleDTO roleDTO)
        {
            try
            {
                if (roleDTO == null)
                {
                    return BadRequest(ApiResponse<object>.BadRequest("Role data is required."));
                }
                var existingRole = await _db.Roles.FirstOrDefaultAsync(r => r.Id == id);
                if (existingRole == null)
                {
                    return NotFound(ApiResponse<object>.NotFound("Role not found."));
                }
                var duplicateRole = await _db.Roles.FirstOrDefaultAsync(r => r.Name == roleDTO.Name && r.Id != id);
                if (duplicateRole != null)
                {
                    return BadRequest(ApiResponse<object>.BadRequest("A role with the same name already exists."));
                }
                _mapper.Map(roleDTO, existingRole);
                existingRole.Id = id; // Ensure the ID remains unchanged
                await _db.SaveChangesAsync();
                var updatedRoleDTO = _mapper.Map<RoleDTO>(existingRole);
                return Ok(ApiResponse<RoleDTO>.Ok(updatedRoleDTO, "Role updated successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while updating the role.", ex.Message));
            }
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<object>>> DeleteRole(int id)
        {
            try
            {
                var existingRole = await _db.Roles.FirstOrDefaultAsync(r => r.Id == id);
                if (existingRole == null)
                {
                    return NotFound(ApiResponse<object>.NotFound("Role not found."));
                }
                _db.Roles.Remove(existingRole);
                await _db.SaveChangesAsync();
                return Ok(ApiResponse<object>.Ok(null, "Role deleted successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while deleting the role.", ex.Message));
            }
        }
    }
}
