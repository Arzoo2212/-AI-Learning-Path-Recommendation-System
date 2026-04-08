using AI_Course_Recommendation_System.Models;
using System.ComponentModel.DataAnnotations;
using System.Xml;
using System.Xml.Linq;
namespace AI_Course_Recommendation_System.Models
{
        public class User
        {
            [Key]
       
            public int Id { get; set; }
            [Required]
            public string Name { get; set; }
            [Required]
        
            public  string Email { get; set; } = string.Empty;
            [Required]
            public int RoleId { get; set; }

            public int ExperienceLevel { get; set; }
            public string CareerGoal { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; }
            public Role Role { get; set; }
            public List<UserSkill> UserSkills { get; set; } = [];

        }
}


//User ID(unique identifier)
//Name
//Email
//Role (or RoleId)
//Experience Level
//Career Goal
