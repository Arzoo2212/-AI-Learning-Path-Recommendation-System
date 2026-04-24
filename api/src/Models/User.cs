using System.ComponentModel.DataAnnotations;

namespace AI_Course_Recommendation_System.Models
{
        public class User
        {
            [Key]
       
            public int Id { get; set; }
            [Required]
            public  required string  Name { get; set; }
            [Required]

            public required string Email { get; set; }
            [Required]
            [MinLength(6)]
            public string Password { get; set; }
            public int RoleId { get; set; }
           
           //  Auth Role
            public int UserRoleId { get; set; }
            public UserRole? UserRole { get; set; }
        public int ExperienceLevel { get; set; }
            public string CareerGoal { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; }= DateTime.UtcNow;
            public Role? Role { get; set; }
            public List<UserSkill> UserSkills { get; set; } = [];

        }
}



