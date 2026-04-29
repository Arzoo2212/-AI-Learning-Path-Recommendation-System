using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.Models;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AI_Course_Recommendation_System.DTO;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AI_Course_Recommendation_System.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthService(ApplicationDbContext db, IConfiguration config, IMapper mapper)
        {
            _db = db;
            _config = config;
            _mapper = mapper;
        }

        // CHECK EMAIL
        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _db.Users.AnyAsync(u => u.Email == email);
        }

        //  REGISTER
        public async Task<UserDTO?> RegisterAsync(CreateUserDTO dto)
        {
            //  Email check
            var email = dto.Email.Trim().ToLower();

            if (await _db.Users.AnyAsync(u => u.Email == email))
                throw new Exception("User already exists");

            //  Auth Role (User)
            var userRole = await _db.UserRoles
                .FirstOrDefaultAsync(r => r.Name.ToLower() == "user");

            if (userRole == null)
                throw new Exception("Default role not found");

            // Job Role Logic
            var roleName = dto.RoleName.Trim().ToLower();

            var role = await _db.Roles
                .FirstOrDefaultAsync(r => r.Name.ToLower() == roleName);

            if (role == null)
            {
                role = new Role
                {
                    Name = dto.RoleName.Trim()
                };

                _db.Roles.Add(role);
                await _db.SaveChangesAsync();
            }

            // User create
            var user = new User
            {
                Name = dto.Name,
                Email = email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),

                UserRoleId = userRole.Id,
                UserRole = userRole,

                RoleId = role.Id,
                Role = role,

                ExperienceLevel = dto.ExperienceLevel,
                CareerGoal = dto.CareerGoal,

                CreatedAt = DateTime.UtcNow
            };

            //  Save
            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();

            return _mapper.Map<UserDTO>(user);
        }

        //  LOGIN
        public async Task<LoginResponseDTO?> LoginAsync(LoginRequestDTO dto)
        {
            var user = await _db.Users
                .Include(u => u.UserRole) //  IMPORTANT
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return null;

            var token = GenerateToken(user);

            return new LoginResponseDTO
            {
                Token = token,
                UserDTO = _mapper.Map<UserDTO>(user)
            };
        }

        //  JWT TOKEN
        private string GenerateToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]);

            if (user.UserRole == null)
                throw new Exception("User role not assigned");

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.UserRole.Name)
            };

            var creds = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],       
                audience: _config["JwtSettings:Audience"],   
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

       
    }
}