using System.ComponentModel.DataAnnotations;

namespace AI_Course_Recommendation_System.Models
{
    public class Skill
    {
        [Key]
       
        public int Id { get; set; }
       [Required]
        public string Name { get; set; }
     
        public List<UserSkill> UserSkills { get; set; } = [];
        public List<RoleSkill> RoleSkills { get; set; } = [];

    }
}
