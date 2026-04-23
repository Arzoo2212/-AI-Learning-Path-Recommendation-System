using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.Models;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using DTOs;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;



namespace AI_Course_Recommendation_System.Controllers
{
    [Route("api/User")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;
        public UserController(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserDTO>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserDTO>>>> GetAllUsers()
        {
            try
            {
                var users = await _db.Users.Include(u=>u.Role).ToListAsync();
                if (users == null || !users.Any())
                {
                    return NotFound(ApiResponse<object>.NotFound("No users found."));
                }
                var userDTOs = _mapper.Map<IEnumerable<UserDTO>>(users);
                return Ok(ApiResponse<IEnumerable<UserDTO>>.Ok(userDTOs, "Users retrieved successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while retrieving users.", ex.Message));
            }
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<UserDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<UserDTO>>> GetUserById(int id)
        {
            try
            {
                var user = await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound(ApiResponse<object>.NotFound("User not found."));
                }
                var userDTO = _mapper.Map<UserDTO>(user);
                return Ok(ApiResponse<UserDTO>.Ok(userDTO, "User retrieved successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while retrieving the user.", ex.Message));
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<UserDTO>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<UserDTO>>> CreateUser(CreateUserDTO userDTO)
        {
            try
            {
                if (userDTO == null)
                {
                    return BadRequest(ApiResponse<object>.BadRequest("User data is required."));
                }
                var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == userDTO.Email);
                if (existingUser != null)
                {
                    return BadRequest(ApiResponse<object>.BadRequest("A user with the same email already exists."));
                } 
                var role =await _db.Roles.FirstOrDefaultAsync(r => r.Name.ToLower() == userDTO.RoleName.ToLower());
                if (role == null) { 
                     return BadRequest(ApiResponse<object>.BadRequest($"Role '{userDTO.RoleName}' does not exist."));
                }
                User user=_mapper.Map<User>(userDTO);
                user.RoleId = role.Id;
                user.CreatedAt = DateTime.UtcNow;
                await _db.Users.AddAsync(user);
                await _db.SaveChangesAsync();
                await _db.Entry(user).Reference(u => u.Role).LoadAsync(); // Load the role to include it in the response
                var response =ApiResponse<UserDTO>.CreatedAt(_mapper.Map<UserDTO>(user), "User created successfully.");
                return response;
            }   
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while creating the user.", ex.Message));
            }
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<UserDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<UserDTO>>> UpdateUser(int id, UpdateUserDTO userDTO)
        {
            try
            {
                if (userDTO == null)
                {
                    return BadRequest(ApiResponse<object>.BadRequest("User data is required."));
                }
                var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (existingUser == null)
                {
                    return NotFound(ApiResponse<object>.NotFound("User not found."));
                }
                var duplicateUser= await _db.Users.FirstOrDefaultAsync(u => u.Email == userDTO.Email && u.Id != id);
                if (duplicateUser != null)
                {
                    return BadRequest(ApiResponse<object>.BadRequest("A user with the same email already exists."));
                }
                var role = await _db.Roles.FirstOrDefaultAsync(r => r.Name == userDTO.RoleName);
                if (role == null)
                {
                    return BadRequest(ApiResponse<object>.BadRequest($"Role '{userDTO.RoleName}' does not exist."));
                }
                _mapper.Map(userDTO, existingUser);
               
                existingUser.RoleId = role.Id; // Update the role ID    
                await _db.SaveChangesAsync();
                await _db.Entry(existingUser).Reference(u => u.Role).LoadAsync(); // Load the role to include it in the response
                var updatedUserDTO = _mapper.Map<UserDTO>(existingUser);
                return Ok(ApiResponse<UserDTO>.Ok(updatedUserDTO, "User updated successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while updating the user.", ex.Message));
            }
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<object>),StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<object>>> DeleteUser(int id)     
        {
            try
            {
                var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (existingUser == null)
                {
                    return NotFound(ApiResponse<object>.NotFound("User not found."));
                }
                _db.Users.Remove(existingUser);
                await _db.SaveChangesAsync();
                return Ok(ApiResponse<object>.Ok(null, "User deleted successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<object>.Error(500, "An error occurred while deleting the user.", ex.Message));
            }
        }
    }
}
