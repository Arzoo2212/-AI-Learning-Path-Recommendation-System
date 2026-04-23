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
            public int RoleId { get; set; }

            public int ExperienceLevel { get; set; }
            public string CareerGoal { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; }
            public Role? Role { get; set; }
            public List<UserSkill> UserSkills { get; set; } = [];

        }
}



