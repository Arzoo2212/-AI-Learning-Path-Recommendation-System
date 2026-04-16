using System.ComponentModel.DataAnnotations;

namespace AI_Course_Recommendation_System.Models
{
    public class RoleSkill
    {
        [Key]
        public int Id { get; set; }
        
        public int RoleId { get; set; }
      
        public Role? Role { get; set; }
        [Range(1,5)]
        public int RequiredLevel { get; set; }
        public int SkillId { get; set; }
        public Skill? Skill { get; set; } 
    }
}
